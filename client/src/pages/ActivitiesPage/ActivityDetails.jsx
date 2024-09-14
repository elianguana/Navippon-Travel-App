import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  CircularProgress,
  Box,
  useTheme,
  Breadcrumbs,
  Link,
} from "@mui/material";
import NavBar from "../../components/NavBar/NavBar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./ActivityDetail.css";
import config from '../../config.js'; 

const ActivityDetails = () => {
  const { palette } = useTheme();
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`${config.API_URL}/activities/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch activity data");
        }

        const data = await response.json();
        setActivity(data);
        fetchCategoryDetails(data.categories);
      } catch (error) {
        console.error("Error fetching activity:", error.message);
      }
    };

    const fetchCategoryDetails = async (categoryNames) => {
      try {
        const response = await fetch(`${config.API_URL}/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();

        const categoryMap = data.reduce((acc, category) => {
          acc[category.category] = category;
          return acc;
        }, {});

        const details = categoryNames.map(
          (name) =>
            categoryMap[name] || { category: name, icon: "defaultIcon.png" }
        );

        console.log("Category Details:", details);
        setCategoryDetails(details);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchActivity();
  }, [id, token]);

  if (!activity) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <NavBar />
      <Box className="activity-detail breadcrumbs-container" sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/home">
            Home
          </Link>
          <Link color="inherit" href="/activities">
            Activities
          </Link>
          <Typography color="textPrimary">{activity.activityName}</Typography>
        </Breadcrumbs>
      </Box>
      <Box className="activity-header" sx={{ mb: 4 }}>
        <img
          src={`${config.API_URL}/assets/${activity.coverPath}`}
          alt={activity.activityName}
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
        <Typography
          variant="h1"
          color="primary"
          className="activity-title"
          sx={{ mt: 2, fontWeight: "bold", color: palette.primary.black }}
        >
          {activity.activityName}
        </Typography>
      </Box>
      <Box className="activity-body">
        <Typography
          className="activity-description"
          sx={{ mb: 3 }}
          style={{ color: palette.primary.dark }}
        >
          {activity.description}
        </Typography>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          {categoryDetails.length
            ? categoryDetails.map((category) => (
                <Typography
                  key={category.category}
                  variant="body2"
                  sx={{
                    mx: 1,
                    fontWeight: "bold",
                    color: "#FF4081",
                    padding: 1,
                    borderRadius: 20,
                    backgroundColor: "#FFE4E7",
                  }}
                >
                  {category.category}
                </Typography>
              ))
            : "No categories"}
        </Box>
        <Typography className="activity-location" sx={{ mb: 1 }}>
          <strong>Prefecture:</strong>{" "}
          <Typography component="span" style={{ color: palette.primary.black }}>
            {activity.prefecture ? activity.prefecture.name : "Loading..."}
          </Typography>
        </Typography>
        <Typography className="activity-location" sx={{ mb: 3 }}>
          <strong>Budget:</strong>{" "}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              padding: "0.25em 0.5em",
              color: "#305D7F",
              borderRadius: "12px",
              backgroundColor: "#CBE3EB",
              fontWeight: "bold",
            }}
          >
            {activity.budget ? activity.budget.name : "Loading..."}{" "}
            {activity.budget ? activity.budget.abbreviation : "Loading..."}
          </Box>
        </Typography>
      </Box>
      <Footer />
    </Box>
  );
};

export default ActivityDetails;
