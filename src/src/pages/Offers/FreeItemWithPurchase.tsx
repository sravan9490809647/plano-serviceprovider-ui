import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import AutoCompleteSelect from "../../components/AutoCompleteSelect";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllItems } from "../../redux/reducers/MenusReducer";
import Storage from "../../utils/Storage";
import type { AppDispatch } from "../../redux/store";
import type { MenuItem } from "../../types";
import ScheduleOffer from "./ScheduleOffer";
import OfferHeader from "./components/OfferHeader";
import ProgressBar from "./components/ProgressBar";
import Input from "../../components/Input";
import ApiService from "../../services/ApiService";
import { toast } from "react-toastify";
import { CURRENCY, ENDPOINTS } from "../../Constants";
import Loader from "../../components/Loader";
import { formatPrice } from "../../utils/common";

const steps = [{ label: "Configure Offer" }, { label: "Finalize" }];
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface FreeItemWithPurchaseProps {
  title: string;
  description: string;
}

const FreeItemWithPurchase: React.FC<FreeItemWithPurchaseProps> = ({
  title,
  description,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const businessId = Storage.getItem("businessId") || "";

  const [currentStep, setCurrentStep] = useState(1);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [spendThreshold, setSpendThreshold] = useState<string>("");
  const [freeItems, setFreeItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [repeatWeekly, setRepeatWeekly] = useState<boolean>(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<
    "all" | "weekdays" | "weekends" | null
  >(null);

  const clearState = () => {
    setOfferTitle("");
    setOfferDescription("");
    setSpendThreshold("");
    setFreeItems([]);
    setStartDate(null);
    setEndDate(null);
    setStartTime(new Date());
    setEndTime(new Date());
    setRepeatWeekly(true);
    setSelectedDays([]);
    setSelectedPreset(null);
    setCurrentStep(1);
  };

  const { items } = useSelector(
    (state: { menus: { items: MenuItem[] } }) => state.menus
  );

  useEffect(() => {
    dispatch(fetchAllItems(businessId));
  }, [dispatch, businessId]);

  const itemList = useMemo(
    () =>
      items.map((c) => ({ label: `${c.title} - ${formatPrice(c.price)}`, value: c.id })),
    [items]
  );
  const onSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        bId: businessId,
        title: offerTitle.trim(),
        description: offerDescription.trim(),
        validFrom: startDate?.toISOString(),
        validTo: endDate?.toISOString(),
        daysOfWeek: selectedDays.join(","),
        spendThreshold: Number(spendThreshold),
        freeItemIds: freeItems,
      };

      const response = await ApiService.request(
        "POST",
        ENDPOINTS.OFFERS.FIXED_AMOUNT_DISCOUNT_SELECTED_ITEMS,
        payload
      );

      if (response.status === 1) {
        toast.success(response?.message || "Offer created successfully!");
        clearState();
      } else if (response.status === 0) {
        toast.error(response?.message || "Failed to create offer.");
      } else if (response?.errors) {
        const messages = Object.entries(response.errors)
          .flatMap(([field, msgs]) =>
            (msgs as string[]).map((msg) => `${field}: ${msg}`)
          )
          .join("\n");
        toast.error(messages);
      } else {
        toast.error(response || "Failed to create offer.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create offer.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleNextStep = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    setSelectedPreset(null);
  };

  const handleSelectAll = () => {
    setSelectedDays([...WEEK_DAYS]);
    setSelectedPreset("all");
  };

  const handleSelectWeekdays = () => {
    setSelectedDays(WEEK_DAYS.slice(0, 5));
    setSelectedPreset("weekdays");
  };

  const handleSelectWeekends = () => {
    setSelectedDays(WEEK_DAYS.slice(5));
    setSelectedPreset("weekends");
  };

  const isStep1Valid =
    spendThreshold.trim() !== "" &&
    Number(spendThreshold) > 0 &&
    freeItems.length > 0 &&
    offerTitle.trim() !== "";

  const isStep2Valid = useMemo(() => {
    if (!startDate || !endDate) return false;
    if (selectedDays.length === 0) return false;
    return true;
  }, [startDate, endDate, selectedDays]);

  return (
    <Box>
      {loading && <Loader />}
      <OfferHeader
        title={title}
        description={description}
        currentStep={currentStep}
        handleNextStep={handleNextStep}
        handlePrevStep={handlePrevStep}
        steps={steps}
        disabled={
          (currentStep === 1 && !isStep1Valid) ||
          (currentStep === 2 && !isStep2Valid)
        }
        onSubmit={onSubmit}
      />

      <Box p={3} pt={1}>
        <ProgressBar currentStep={currentStep} steps={steps} />

        {currentStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomPaperWrapper>
                <Input
                  value={offerTitle}
                  label="Offer Title"
                  placeholder="Enter offer title"
                  onChange={(e) => setOfferTitle(e.target.value)}
                  fullWidth
                />
                <Input
                  value={offerDescription}
                  label="Offer Description"
                  placeholder="Enter offer description"
                  onChange={(e) => setOfferDescription(e.target.value)}
                  fullWidth
                  multiline
                  maxRows={3}
                  sx={{ mt: 2 }}
                />
              </CustomPaperWrapper>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomPaperWrapper>
                <Input
                  value={spendThreshold}
                  label={`Spend Threshold (${CURRENCY.symbol})`}
                  placeholder="e.g., 25.00"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSpendThreshold(e.target.value)
                  }
                  InputProps={{
                    startAdornment: <Typography mr={1}>{CURRENCY.symbol}</Typography>,
                  }}
                  fullWidth
                  type="number"
                />
                <Typography variant="h6" sx={{ fontSize: 12 }} mt={0.5}>
                  Minimum amount customer must spend to get the free item
                </Typography>
              </CustomPaperWrapper>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomPaperWrapper>
                <AutoCompleteSelect<string>
                  fullWidth
                  label="Select Free Item(s)"
                  value={freeItems}
                  onChange={(_, val) => setFreeItems(val as string[])}
                  options={itemList}
                  multiple
                />
              </CustomPaperWrapper>
            </Grid>
          </Grid>
        )}

        {currentStep === 2 && (
          <ScheduleOffer
            startDate={startDate}
            endDate={endDate}
            startTime={startTime}
            endTime={endTime}
            repeatWeekly={repeatWeekly}
            selectedDays={selectedDays}
            selectedPreset={selectedPreset || ""}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onRepeatWeeklyChange={setRepeatWeekly}
            onDayToggle={handleDayToggle}
            onSelectAll={handleSelectAll}
            onSelectWeekdays={handleSelectWeekdays}
            onSelectWeekends={handleSelectWeekends}
          />
        )}
      </Box>
    </Box>
  );
};

export default FreeItemWithPurchase;
