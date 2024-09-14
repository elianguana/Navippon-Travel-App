import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActivities } from "../../state/state.js";
import ActivityWidget from "./ActivityWidget.jsx";
import { Skeleton, Typography, Box, Button, useTheme } from "@mui/material";
import {
  fetchActivities,
  saveOrUnsaveActivity,
  deleteActivity,
} from "../../services/services.js";
import "../ActivitiesPage/Activities.css";
const ActivitiesWidget = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.token);
  const activities = useSelector((state) => state.activities);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [filter, setFilter] = useState("activities");
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetchActivities(token);
        dispatch(setActivities(data));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [dispatch, token]);

  const handleSave = async (activityId, isSaved) => {
    try {
      const updatedActivity = await saveOrUnsaveActivity(
        loggedInUserId,
        activityId,
        isSaved,
        token
      );
      dispatch(
        setActivities(
          activities.map((activity) =>
            activity._id === updatedActivity._id
              ? { ...activity, isSaved: !isSaved }
              : activity
          )
        )
      );
    } catch (error) {
      console.error("Error updating favorite activities:", error.message);
    }
  };
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };
  const handleDelete = async (activityId) => {
    try {
      await deleteActivity(activityId, token);
      dispatch(
        setActivities(
          activities.filter((activity) => activity._id !== activityId)
        )
      );
    } catch (error) {
      console.error("Error deleting activity:", error.message);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton
          variant="rectangular"
          width={350}
          height={200}
          sx={{ marginTop: 2, borderRadius: "8px" }}
        />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Results:</h2>
      <Box className="filter-buttons" style={{ marginBottom: "2rem" }}>
        <Button
          variant={filter === "activities" ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleFilterChange("activities")}
        >
          Activities
        </Button>
        <Button
          variant={filter === "restaurants" ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleFilterChange("restaurants")}
        >
          Restaurants
        </Button>
        <Button
          variant={filter === "hotels" ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleFilterChange("hotels")}
        >
          Hotels
        </Button>
      </Box>
      {activities.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No activities available.
        </Typography>
      ) : (
        <Box justifyContent="center">
          {activities.map((activity) => (
            <Box key={activity._id}>
              <ActivityWidget
                {...activity}
                activityId={activity._id}
                filter={filter}
                onSave={(isSaved) => handleSave(activity._id, isSaved)}
                onDelete={() => handleDelete(activity._id)}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ActivitiesWidget;
