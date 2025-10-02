import React, { useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CustomInput from "../../components/Input";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";
import ScheduleOffer from "./ScheduleOffer";
import OfferHeader from "./components/OfferHeader";
import ProgressBar from "./components/ProgressBar";
import OfferPreview from "./components/OfferPreview";
import ApiService from "../../services/ApiService";
import { CURRENCY, ENDPOINTS } from "../../Constants";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { formatPrice } from "../../utils/common";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const steps = [{ label: "Configure Offer" }, { label: "Finalize" }];

const PercentageDiscountWholeOrder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
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

  const bId = localStorage.getItem("businessId") || "";

  const handleNextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
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
    title.trim() !== "" &&
    discountPercent.trim() !== "" &&
    Number(discountPercent) > 0 &&
    Number(discountPercent) <= 100;

  const isStep2Valid = useMemo(() => {
    if (!startDate || !endDate) return false;
    if (selectedDays.length === 0) return false;
    return true;
  }, [startDate, endDate, selectedDays]);

  const clearState = () => {
    setTitle("");
    setDescription("");
    setDiscountPercent("");
    setMinSpend("");
    setMaxDiscount("");
    setStartDate(null);
    setEndDate(null);
    setStartTime(new Date());
    setEndTime(new Date());
    setRepeatWeekly(true);
    setSelectedDays([]);
    setSelectedPreset(null);
    setCurrentStep(1);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        bId,
        title: title.trim(),
        description: description.trim(),
        validFrom: startDate?.toISOString(),
        validTo: endDate?.toISOString(),
        daysOfWeek: selectedDays.join(","),
        percentage: Number(discountPercent),
        minSpend: Number(minSpend) || 0,
        maxDiscount: Number(maxDiscount) || 0,
      };

      const response = await ApiService.request(
        "POST",
        ENDPOINTS.OFFERS.PERCENTAGE_WHOLE_ORDER,
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
        title="Percentage Discount - Whole Order"
        description="Apply percentage discount to the entire order total"
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
                    fullWidth
                    label="Offer Title"
                    name="title"
                    placeholder="Enter offer title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    fullWidth
                    label="Offer Description"
                    name="description"
                    placeholder="Enter offer description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxRows={3}
                    multiline
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomInput
                    value={discountPercent}
                    label="Discount Percentage (%)"
                    placeholder="e.g. 10"
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    fullWidth
                    type="number"
                    InputProps={{
                      startAdornment: <Typography mr={1}>%</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomInput
                    value={minSpend}
                    label={`Minimum Spend (${CURRENCY.symbol}) - Optional`}
                    placeholder="e.g. 15"
                    onChange={(e) => setMinSpend(e.target.value)}
                    fullWidth
                    type="number"
                    InputProps={{
                      startAdornment: <Typography mr={1}>{CURRENCY.symbol}</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomInput
                    value={maxDiscount}
                    label={`Max Discount (${CURRENCY.symbol}) - Optional`}
                    placeholder="e.g. 20"
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    fullWidth
                    type="number"
                    InputProps={{
                      startAdornment: <Typography mr={1}>{CURRENCY.symbol}</Typography>,
                    }}
                  />
                </Grid>
              </Grid>
            </CustomPaperWrapper>

            {discountPercent && (
              <OfferPreview
                icon="%"
                iconColor="#28a745"
                previewTitle="Offer Preview"
                mainValue={`${discountPercent}% OFF`}
                mainValueColor="#28a745"
                subtitle="Entire Order Discount"
                description={`Customers will get ${discountPercent}% off their entire order when they spend at least ${formatPrice(minSpend || 0)}${maxDiscount ? ` (max discount: ${formatPrice(maxDiscount)})` : ""}.`}
                leftTag="📈 Order Wide"
                rightTag="⚡ Automatic"
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

export default PercentageDiscountWholeOrder;
