import React, { useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CustomInput from "../../components/Input";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";
import ScheduleOffer from "./ScheduleOffer";
import OfferHeader from "./components/OfferHeader";
import ProgressBar from "./components/ProgressBar";
import OfferPreview from "./components/OfferPreview";
import ApiService from "../../services/ApiService";
import { toast } from "react-toastify";
import Storage from "../../utils/Storage";
import Loader from "../../components/Loader";
import { CURRENCY, ENDPOINTS } from "../../Constants";
import { formatPrice } from "../../utils/common";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const steps = [{ label: "Configure Offer" }, { label: "Finalize" }];

const FixedAmountDiscountWholeOrder: React.FC = () => {
  const businessId = Storage.getItem("businessId") || "";
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fixedAmount, setFixedAmount] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
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
    setTitle("");
    setDescription("");
    setFixedAmount("");
    setMinSpend("");
    setCurrentStep(1);
    setStartDate(null);
    setEndDate(null);
    setStartTime(new Date());
    setEndTime(new Date());
    setRepeatWeekly(true);
    setSelectedDays([]);
    setSelectedPreset(null);
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
    fixedAmount.trim() !== "" && Number(fixedAmount) > 0 && title.trim() !== "";

  const isStep2Valid = useMemo(() => {
    if (!startDate || !endDate) return false;
    if (selectedDays.length === 0) return false;
    return true;
  }, [startDate, endDate, selectedDays]);
  const onSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        bId: businessId,
        title: title.trim(),
        description: description.trim(),
        validFrom: startDate?.toISOString(),
        validTo: endDate?.toISOString(),
        daysOfWeek: selectedDays.join(","),
        amount: Number(fixedAmount),
        minSpend: minSpend ? Number(minSpend) : 0,
      };

      const response = await ApiService.request(
        "POST",
        ENDPOINTS.OFFERS.FIXED_AMOUNT_DISCOUNT_WHOLE_ORDER,
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
  return (
    <Box>
      {loading && <Loader />}
      <OfferHeader
        title="Fixed Amount Discount - Whole Order"
        description="Apply fixed pound amount discount to the entire order"
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
      <Box p={3}>
        <ProgressBar currentStep={currentStep} steps={steps} />
        {currentStep === 1 && (
          <>
            <CustomPaperWrapper sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomInput
                    value={title}
                    label="Offer Title"
                    placeholder="Enter offer title"
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    value={description}
                    label="Offer Description"
                    placeholder="Enter offer description"
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    maxRows={3}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    value={fixedAmount}
                    label={`Discount Amount (${CURRENCY.symbol})`}
                    placeholder="e.g. 5.00"
                    onChange={(e) => setFixedAmount(e.target.value)}
                    InputProps={{
                      startAdornment: <Typography mr={1}>{CURRENCY.symbol}</Typography>,
                    }}
                    fullWidth
                    type="number"
                  />
                  <Typography variant="h6" sx={{ fontSize: 12 }} mt={0.5}>
                    Fixed amount to deduct from the total order
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    value={minSpend}
                    label={`Minimum Spend (${CURRENCY.symbol}) - Optional`}
                    placeholder="e.g. 20.00"
                    onChange={(e) => setMinSpend(e.target.value)}
                    fullWidth
                    type="number"
                    InputProps={{
                      startAdornment: <Typography mr={1}>{CURRENCY.symbol}</Typography>,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontSize: 12 }} mt={0.5}>
                    Leave empty for no minimum spend requirement
                  </Typography>
                </Grid>
              </Grid>
            </CustomPaperWrapper>

            {fixedAmount && (
              <OfferPreview
                icon="💷"
                iconColor="#7B61FF"
                previewTitle="Offer Preview"
                mainValue={`${formatPrice(fixedAmount)} OFF`}
                mainValueColor="#7B61FF"
                subtitle="Entire Order Discount"
                description={`Customers will get ${formatPrice(fixedAmount)} off their entire order when they spend at least ${formatPrice(minSpend || 0)}.`}
                leftTag="📈 Order Wide"
                rightTag="⚡ Fixed Amount"
              />
            )}
          </>
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

export default FixedAmountDiscountWholeOrder;
