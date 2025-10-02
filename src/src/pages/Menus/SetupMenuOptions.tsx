import { Box, Grid, Typography, Card, CardContent, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import CustomButton from "../../components/Button";

const options = [
  {
    icon: <CameraAltOutlinedIcon sx={{ fontSize: 40 }} />,
    title: "📷 Upload Physical Menu",
    description:
      "Upload images or PDFs of your printed menu. We'll digitize it with our AI and have it ready in minutes.",
    bullets: [
      "Upload images or PDFs",
      "AI-powered auto digitization",
      "Fast turnaround",
    ],
    button: "Start Upload",
    url: "/menus/uploadmenu",
  },
  {
    icon: <BuildCircleOutlinedIcon sx={{ fontSize: 40 }} />,
    title: "⚙️ Create Menu Manually",
    description:
      "Start from scratch and build your digital menu step by step. Fully customizable with categories, options, and images.",
    bullets: [
      "Create your own menu from scratch",
      "Add categories and items with images",
      "Define sizes, add-ons, and option groups",
    ],
    button: "Start Manual Setup",
    url: "/menus/add",
  },
  {
    icon: <HourglassBottomOutlinedIcon sx={{ fontSize: 40 }} />,
    title: "⏳ Let Us Create Your Menu (Free)",
    description:
      "Our team will manually build your menu for you. Upload a menu file, and we’ll take care of everything.",
    bullets: [
      "Human-reviewed and error-free",
      "Setup ready within 2–3 business days",
      "Perfect for busy restaurant owners",
    ],
    button: "Request Manual Setup",
    url: "",
  },
];

const SetupMenuOptions = () => {
  const navigate = useNavigate();

  return (
    <Box
      maxWidth="lg"
      mx="auto"
      py={{ xs: 3, md: 6 }}
      px={{ xs: 1, md: 2 }}
      mt={{ xs: "200px", md: 8 }}
    >
      {" "}
      <Typography variant="h4" align="center" gutterBottom>
        Let's Set Up Your Menu
      </Typography>
      <Typography align="center" color="text.secondary" mb={4}>
        Choose how you'd like to get your menu online. All options are
        completely free!
      </Typography>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        {options.map((option, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: 2,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box mb={2}>{option.icon}</Box>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {option.title}
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  {option.description}
                </Typography>

                <Stack
                  spacing={1}
                  mb={3}
                  alignItems={{ xs: "center", md: "flex-start" }}
                >
                  {option.bullets.map((bullet, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <CheckCircleIcon fontSize="small" color="success" />
                      <Typography variant="body2">{bullet}</Typography>
                    </Stack>
                  ))}
                </Stack>

                <Box mt="auto">
                  <CustomButton
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => option.url && navigate(option.url)}
                  >
                    {option.button}
                  </CustomButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SetupMenuOptions;
