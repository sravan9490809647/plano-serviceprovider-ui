import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import AutoCompleteSelect from "../../components/AutoCompleteSelect";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetCategoryAndItemsByBusinessId } from "../../redux/reducers/MenusReducer";
import { fetchCategoriesByBusinessId } from "../../redux/reducers/CategoryReducer";
import Storage from "../../utils/Storage";
import type { AppDispatch } from "../../redux/store";
import type { CategoryWithItems, MenuCategory } from "../../types";
import ScheduleOffer from "./ScheduleOffer";
import Input from "../../components/Input";
import OfferHeader from "./components/OfferHeader";
import ProgressBar from "./components/ProgressBar";
import { toast } from "react-toastify";
import ApiService from "../../services/ApiService";
import { CURRENCY, ENDPOINTS } from "../../Constants";
import Loader from "../../components/Loader";
import { formatPrice } from "../../utils/common";

const steps = [{ label: "Configure Offer" }, { label: "Finalize" }];
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface IPercentageOrAmountDiscountSelectedItems {
  type: "percentage" | "amount";
  title: string;
  description: string;
}

const PercentageOrAmountDiscountSelectedItems: React.FC<
  IPercentageOrAmountDiscountSelectedItems
> = ({ type, title, description }) => {
  const dispatch: AppDispatch = useDispatch();
  const businessId = Storage.getItem("businessId") || "";
  const [loading, setLoading] = useState(false);

  const [discountPercent, setDiscountPercent] = useState("");
  const [fixedAmount, setFixedAmount] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<
    "all" | "weekdays" | "weekends" | null
  >(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [freeCategories, setFreeCategories] = useState<string[]>([]);
  const [selectedFreeItemsMap, setSelectedFreeItemsMap] = useState<
    Record<string, string[]>
  >({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [repeatWeekly, setRepeatWeekly] = useState<boolean>(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const { categoryWithItems } = useSelector(
    (state: { menus: { categoryWithItems: CategoryWithItems[] } }) =>
      state.menus
  );
  const { categoriesList } = useSelector(
    (state: { categories: { categoriesList: MenuCategory[] } }) =>
      state.categories
  );

  useEffect(() => {
    dispatch(fetchGetCategoryAndItemsByBusinessId(businessId));
    dispatch(fetchCategoriesByBusinessId(businessId));
  }, [dispatch, businessId]);

  const categoryOptions = useMemo(
    () => categoriesList.map((c) => ({ label: c.title, value: c.id })),
    [categoriesList]
  );

  const handleFreeCategoryChange = (val: string[]) => {
    setFreeCategories(val);
    const updated: Record<string, string[]> = {};
    val.forEach((catId) => {
      updated[catId] = selectedFreeItemsMap[catId] || [];
    });
    setSelectedFreeItemsMap(updated);
  };

  const handleNextStep = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  const clearState = () => {
    setDiscountPercent("");
    setFixedAmount("");
    setOfferTitle("");
    setOfferDescription("");
    setSelectedPreset(null);
    setCurrentStep(1);
    setFreeCategories([]);
    setSelectedFreeItemsMap({});
    setStartDate(null);
    setEndDate(null);
    setStartTime(new Date());
    setEndTime(new Date());
    setRepeatWeekly(true);
    setSelectedDays([]);
  };
  const onSubmit = async () => {
    try {
      const freeItemIds = Object.values(selectedFreeItemsMap).flat();

      const payload = {
        bId: businessId,
        title: offerTitle.trim(),
        description: offerDescription.trim(),
        validFrom: startDate?.toISOString(),
        validTo: endDate?.toISOString(),
        daysOfWeek: selectedDays.join(","),
        amount:
          type === "amount" ? Number(fixedAmount) : Number(discountPercent),
        freeCategoryIds: freeCategories,
        freeItemIds,
      };

      const endpoint =
        type === "percentage"
          ? ENDPOINTS.OFFERS.PERCENTAGE_DISCOUNT_SELECTED_ITEMS
          : ENDPOINTS.OFFERS.AMOUNT_DISCOUNT_SELECTED_ITEMS;
      setLoading(true);

      const response = await ApiService.request("POST", endpoint, payload);

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
  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStep1Valid =
    freeCategories.length > 0 &&
    Object.values(selectedFreeItemsMap).some((items) => items.length > 0) &&
    ((type === "percentage" &&
      discountPercent.trim() !== "" &&
      Number(discountPercent) > 0 &&
      Number(discountPercent) <= 100) ||
      (type === "amount" &&
        fixedAmount.trim() !== "" &&
        Number(fixedAmount) > 0));

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
          <Grid container spacing={3} justifyContent={"center"}>
            <Grid item xs={12} sm={8} spacing={3}>
              <CustomPaperWrapper>
                <Input
                  value={offerTitle}
                  label="Offer Title"
                  placeholder="Offer Title"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOfferTitle(e.target.value)
                  }
                  fullWidth
                />
                <Input
                  value={offerDescription}
                  label="Offer Description"
                  placeholder="Offer Description"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOfferDescription(e.target.value)
                  }
                  fullWidth
                  multiline
                  maxRows={3}
                  sx={{ mt: 2 }}
                />
                {type === "percentage" ? (
                  <>
                    <Input
                      value={discountPercent}
                      label="Discount Percentage (%)"
                      placeholder="Discount Percentage"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDiscountPercent(e.target.value)
                      }
                      InputProps={{
                        startAdornment: <Typography mr={1}>%</Typography>,
                      }}
                      fullWidth
                      type="number"
                      sx={{ mt: 2 }}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      value={fixedAmount}
                      label={`Discount Amount (${CURRENCY.symbol})`}
                      placeholder="Discount Amount"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFixedAmount(e.target.value)
                      }
                      InputProps={{
                        startAdornment: <Typography mr={1}>{CURRENCY.symbol}</Typography>,
                      }}
                      fullWidth
                      type="number"
                      sx={{ mt: 2 }}
                    />
                  </>
                )}

                <Typography variant="h6" my={2}>
                  Select Categories
                </Typography>
                <AutoCompleteSelect<string>
                  fullWidth
                  label="Categories"
                  value={freeCategories}
                  onChange={(_, val) =>
                    handleFreeCategoryChange(val as string[])
                  }
                  options={categoryOptions}
                  multiple
                />
                {freeCategories.map((catId) => {
                  const cat = categoriesList.find((c) => c.id === catId);
                  const items =
                    categoryWithItems.find((c) => c.category.id === catId)
                      ?.items || [];
                  return (
                    <Box key={catId} mt={2}>
                      <Typography variant="h6">
                        Select {cat?.title} Items
                      </Typography>
                      <AutoCompleteSelect<string>
                        fullWidth
                        label={`${cat?.title} Items`}
                        value={selectedFreeItemsMap[catId] || []}
                        onChange={(_, val) =>
                          setSelectedFreeItemsMap((prev) => ({
                            ...prev,
                            [catId]: val as string[],
                          }))
                        }
                        options={items.map((i) => ({
                          label: `${i.title} - ${formatPrice(i.price)}`,
                          value: i.id,
                        }))}
                        multiple
                      />
                    </Box>
                  );
                })}
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
            onDayToggle={(day) => {
              setSelectedDays((prev) =>
                prev.includes(day)
                  ? prev.filter((d) => d !== day)
                  : [...prev, day]
              );
              setSelectedPreset(null);
            }}
            onSelectAll={() => {
              setSelectedDays([...WEEK_DAYS]);
              setSelectedPreset("all");
            }}
            onSelectWeekdays={() => {
              setSelectedDays(WEEK_DAYS.slice(0, 5));
              setSelectedPreset("weekdays");
            }}
            onSelectWeekends={() => {
              setSelectedDays(WEEK_DAYS.slice(5));
              setSelectedPreset("weekends");
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default PercentageOrAmountDiscountSelectedItems;
