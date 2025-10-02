import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import AutoCompleteSelect from "../../components/AutoCompleteSelect";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";
import CustomButton from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetCategoryAndItemsByBusinessId } from "../../redux/reducers/MenusReducer";
import { fetchCategoriesByBusinessId } from "../../redux/reducers/CategoryReducer";
import Storage from "../../utils/Storage";
import type { AppDispatch } from "../../redux/store";
import type { CategoryWithItems, MenuCategory } from "../../types";
import ReviewOfferStep from "./ReviewOfferDetails";
import ScheduleOffer from "./ScheduleOffer";
import OfferHeader from "./components/OfferHeader";
import ProgressBar from "./components/ProgressBar";
import { toast } from "react-toastify";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import Loader from "../../components/Loader";
import Input from "../../components/Input";
import { formatPrice } from "../../utils/common";

const steps = [
  { label: "Configure Offer" },
  { label: "Review Offer" },
  { label: "Finalize" },
];
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BuyOneGetOneOffer: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const businessId = Storage.getItem("businessId") || "";
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [qualifyingCategory, setQualifyingCategory] = useState<string>("");
  const [freeCategories, setFreeCategories] = useState<string[]>([]);
  const [selectedQualifyingItems, setSelectedQualifyingItems] = useState<
    string[]
  >([]);
  const [selectedFreeItemsMap, setSelectedFreeItemsMap] = useState<
    Record<string, string[]>
  >({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [repeatWeekly, setRepeatWeekly] = useState<boolean>(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<
    "all" | "weekdays" | "weekends" | null
  >(null);
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

  const validQualifyingItems = useMemo(() => {
    return (
      categoryWithItems.find((c) => c.category.id === qualifyingCategory)
        ?.items || []
    );
  }, [qualifyingCategory, categoryWithItems]);

  const handleFreeCategoryChange = (val: string[]) => {
    setFreeCategories(val);
    const updated: Record<string, string[]> = {};
    val.forEach((catId) => {
      updated[catId] = selectedFreeItemsMap[catId] || [];
    });
    setSelectedFreeItemsMap(updated);
  };
  const isStep1Valid = useMemo(() => {
    if (!title) return false;
    if (!description) return false;
    if (!qualifyingCategory) return false;
    if (selectedQualifyingItems.length === 0) return false;

    if (freeCategories.length === 0) return false;

    for (const catId of freeCategories) {
      if (
        !selectedFreeItemsMap[catId] ||
        selectedFreeItemsMap[catId].length === 0
      ) {
        return false;
      }
    }

    return true;
  }, [
    title,
    description,
    qualifyingCategory,
    selectedQualifyingItems,
    freeCategories,
    selectedFreeItemsMap,
  ]);

  const handleNextStep = () => {
    if (currentStep === 1 && !isStep1Valid) {
      toast.error("Step 1: Please fill all required fields.");
      return;
    }
    if (currentStep === 3 && !isStep3Valid) {
      toast.error("Step 3: Please select schedule.");
      return;
    }
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };
  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleToggleQualifying = () => {
    const allIds = validQualifyingItems.map((i) => i.id);
    if (allIds.every((id) => selectedQualifyingItems.includes(id))) {
      setSelectedQualifyingItems([]);
    } else {
      setSelectedQualifyingItems(allIds);
    }
  };

  const handleToggleFree = (catId: string) => {
    const items =
      categoryWithItems.find((c) => c.category.id === catId)?.items || [];
    const allIds = items.map((i) => i.id);
    const selected = selectedFreeItemsMap[catId] || [];
    if (allIds.every((id) => selected.includes(id))) {
      setSelectedFreeItemsMap((prev) => ({ ...prev, [catId]: [] }));
    } else {
      setSelectedFreeItemsMap((prev) => ({ ...prev, [catId]: allIds }));
    }
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
  const reviewData = useMemo(() => {
    const qualifyingItemsTitles =
      categoryWithItems
        .find((c) => c.category.id === qualifyingCategory)
        ?.items.filter((i) => selectedQualifyingItems.includes(i.id))
        .map((i) => i.title) || [];

    const freeCategoriesData = Object.entries(selectedFreeItemsMap).map(
      ([catId, itemIds]) => {
        const catTitle =
          categoriesList.find((c) => c.id === catId)?.title || "";
        const items =
          categoryWithItems
            .find((c) => c.category.id === catId)
            ?.items.filter((i) => itemIds.includes(i.id))
            .map((i) => i.title) || [];
        return { category: catTitle, items };
      }
    );

    return {
      qualifyingCategory:
        categoriesList.find((c) => c.id === qualifyingCategory)?.title || "",
      qualifyingItems: qualifyingItemsTitles,
      freeCategories: freeCategoriesData,
    };
  }, [
    qualifyingCategory,
    selectedQualifyingItems,
    selectedFreeItemsMap,
    categoryWithItems,
    categoriesList,
  ]);
  const isStep3Valid = useMemo(() => {
    if (!startDate || !endDate) return false;
    if (selectedDays.length === 0) return false;
    return true;
  }, [startDate, endDate, selectedDays]);
  const dayMap: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  const preparePayload = () => {
    const daysOfWeekNumbers = selectedDays
      .map((day) => dayMap[day])
      .filter(Boolean)
      .sort((a, b) => a - b)
      .join(",");

    return {
      bId: businessId,
      title: title,
      description: description,
      validFrom: startDate ? startDate.toISOString() : "",
      validTo: endDate ? endDate.toISOString() : "",
      daysOfWeek: daysOfWeekNumbers,
      qualifyingCategoryIds: [qualifyingCategory],
      qualifyingItemIds: selectedQualifyingItems,
      freeCategoryIds: freeCategories,
      freeItemIds: Object.values(selectedFreeItemsMap).flat(),
    };
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else {
      setDescription(value);
    }
  };

  const onSubmit = async () => {
    if (!isStep3Valid) {
      toast.error("Please complete all required fields before submitting.");
      return;
    }

    const payload = preparePayload();

    try {
      setLoading(true);
      const response = await ApiService.request(
        "POST",
        ENDPOINTS.OFFERS.BUYONE_GETONE_OFFER,
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
  const clearState = () => {
    setTitle("");
    setDescription("");
    setCurrentStep(1);
    setQualifyingCategory("");
    setFreeCategories([]);
    setSelectedQualifyingItems([]);
    setSelectedFreeItemsMap({});
    setStartDate(null);
    setEndDate(null);
    setStartTime(new Date());
    setEndTime(new Date());
    setRepeatWeekly(true);
    setSelectedDays([]);
    setSelectedPreset(null);
  };
  return (
    <Box>
      {loading && <Loader />}
      <OfferHeader
        title="Buy 1, Get a Free Item"
        description="Configure your offer to start attracting more customers"
        currentStep={currentStep}
        handleNextStep={handleNextStep}
        handlePrevStep={handlePrevStep}
        steps={steps}
        disabled={
          (currentStep === 1 && !isStep1Valid) ||
          (currentStep === 3 && !isStep3Valid)
        }
        onSubmit={onSubmit}
      />

      <Box p={3} pt={1}>
        <ProgressBar currentStep={currentStep} steps={steps} />

        {currentStep === 1 && (
          <Grid container spacing={3}>
            {/* Qualifying */}
            <Grid item xs={12}>
              <Input
                fullWidth
                label="Offer Title"
                name="title"
                placeholder="Enter offer title"
                value={title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                fullWidth
                label="Offer Description"
                name="description"
                placeholder="Enter offer description"
                value={description}
                onChange={handleChange}
                maxRows={3}
                multiline
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomPaperWrapper>
                <Typography variant="h5" mb={2}>
                  Qualifying Items
                </Typography>
                <AutoCompleteSelect<string>
                  fullWidth
                  label="Category"
                  value={qualifyingCategory}
                  onChange={(_, val) => {
                    setQualifyingCategory(val as string);
                    setSelectedQualifyingItems([]);
                  }}
                  options={categoryOptions}
                />
                {qualifyingCategory && (
                  <Box mt={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mb={1}
                    >
                      <Typography>
                        {
                          categoriesList.find(
                            (c) => c.id === qualifyingCategory
                          )?.title
                        }{" "}
                        Items
                      </Typography>
                      <CustomButton
                        variant="text"
                        sx={{ height: 30, padding: 1 }}
                        onClick={handleToggleQualifying}
                      >
                        {validQualifyingItems.every((i) =>
                          selectedQualifyingItems.includes(i.id)
                        )
                          ? "Unselect All"
                          : "Select All"}
                      </CustomButton>
                    </Stack>
                    <AutoCompleteSelect<string>
                      fullWidth
                      label="Items"
                      value={selectedQualifyingItems}
                      onChange={(_, val) =>
                        setSelectedQualifyingItems(val as string[])
                      }
                      options={validQualifyingItems.map((i) => ({
                        label: `${i.title} - ${formatPrice(i.price)}`,
                        value: i.id,
                      }))}
                      multiple
                    />
                  </Box>
                )}
              </CustomPaperWrapper>
            </Grid>

            {/* Free */}
            <Grid item xs={12} md={6}>
              <CustomPaperWrapper>
                <Typography variant="h5" mb={2}>
                  Free Items
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
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography>{cat?.title} Items</Typography>
                        <CustomButton
                          variant="text"
                          sx={{ height: 30, padding: 1 }}
                          onClick={() => handleToggleFree(catId)}
                        >
                          {items.every((i) =>
                            (selectedFreeItemsMap[catId] || []).includes(i.id)
                          )
                            ? "Unselect All"
                            : "Select All"}
                        </CustomButton>
                      </Stack>
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
          <ReviewOfferStep
            qualifyingCategory={reviewData.qualifyingCategory}
            qualifyingItems={reviewData.qualifyingItems}
            freeCategories={reviewData.freeCategories}
          />
        )}

        {currentStep === 3 && (
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

export default BuyOneGetOneOffer;
