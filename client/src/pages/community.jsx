import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  CircularProgress
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VideocamIcon from "@mui/icons-material/Videocam";
import EventIcon from "@mui/icons-material/Event";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";

const CommunityNetwork = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [userInfo, setUserInfo] = useState({
    careerPath: "Full Stack Development",
    currentSkillLevel: "intermediate",
    location: "Pretoria, Gauteng",
    preferredLearningStyle: "collaborative"
  });
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [studyBuddyDialogOpen, setStudyBuddyDialogOpen] = useState(false);

  // Mock data - in real app, this would come from API
  const [communityData, setCommunityData] = useState({
    whatsappGroups: [
      {
        id: 1,
        name: "Full Stack Developers SA",
        description: "Daily coding discussions, project showcases, and job opportunities",
        members: 1247,
        category: "Full Stack Development",
        level: "all",
        activity: "very-active",
        location: "South Africa",
        verified: true,
        tags: ["React", "Node.js", "Career Growth"],
        lastMessage: "2 minutes ago"
      },
      {
        id: 2,
        name: "Pretoria Tech Community",
        description: "Local developers networking and meetups in Pretoria",
        members: 342,
        category: "General Tech",
        level: "all",
        activity: "active",
        location: "Pretoria",
        verified: true,
        tags: ["Networking", "Meetups", "Local"],
        lastMessage: "15 minutes ago"
      },
      {
        id: 3,
        name: "JavaScript Intermediate Learners",
        description: "Perfect for intermediate developers learning advanced JS concepts",
        members: 892,
        category: "JavaScript",
        level: "intermediate",
        activity: "active",
        location: "Global",
        verified: false,
        tags: ["JavaScript", "Learning", "Projects"],
        lastMessage: "1 hour ago"
      }
    ],
    localEvents: [
      {
        id: 1,
        title: "Pretoria JavaScript Meetup",
        date: "2025-06-15",
        time: "18:00",
        location: "Innovation Hub, Pretoria",
        attendees: 67,
        maxAttendees: 80,
        type: "in-person",
        tags: ["JavaScript", "Networking"],
        organizer: "Pretoria Tech Community"
      },
      {
        id: 2,
        title: "Full Stack Career Panel",
        date: "2025-06-20",
        time: "19:00",
        location: "Virtual Event",
        attendees: 234,
        maxAttendees: 500,
        type: "virtual",
        tags: ["Career", "Panel Discussion"],
        organizer: "Tech Career Network"
      }
    ],
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleJoinGroup = (group) => {
    setSelectedGroup(group);
    setJoinDialogOpen(true);
  };


  const getActivityColor = (activity) => {
    switch (activity) {
      case "very-active": return "success";
      case "active": return "warning";
      case "moderate": return "info";
      default: return "default";
    }
  };

  const getLevelChipColor = (level) => {
    switch (level) {
      case "beginner": return "primary";
      case "intermediate": return "secondary";
      case "advanced": return "error";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
          Community Network
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={3}>
          Connect with fellow learners, join study groups, and grow together
        </Typography>
        
        {/* Quick Stats */}
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Chip 
              icon={<WhatsAppIcon />} 
              label="15 WhatsApp Groups"
              color="success"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Chip 
              icon={<EventIcon />} 
              label="23 Events This Month"
              color="warning"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
          <Tab icon={<WhatsAppIcon />} label="WhatsApp Groups" />
          <Tab icon={<EventIcon />} label="Local Events" />
        </Tabs>
      </Box>

      {/* WhatsApp Groups Tab */}
      {activeTab === 0 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Smart Matching:</strong> Groups are recommended based on your career path ({userInfo.careerPath}) and skill level ({userInfo.currentSkillLevel}).
          </Alert>
          
          <Grid container spacing={3}>
            {communityData.whatsappGroups.map((group) => (
              <Grid item xs={12} md={6} lg={4} key={group.id}>
                <Card sx={{ height: "100%", position: "relative" }}>
                  {group.verified && (
                    <Chip
                      icon={<StarIcon />}
                      label="Verified"
                      size="small"
                      color="primary"
                      sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
                    />
                  )}
                  
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                        <WhatsAppIcon />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" noWrap>{group.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {group.members.toLocaleString()} members • {group.location}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {group.description}
                    </Typography>
                    
                    <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                      <Chip 
                        label={group.level} 
                        size="small" 
                        color={getLevelChipColor(group.level)}
                      />
                      <Chip 
                        label={group.activity} 
                        size="small" 
                        color={getActivityColor(group.activity)}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                      {group.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Last message: {group.lastMessage}
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="success"
                        size="small"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => handleJoinGroup(group)}
                      >
                        Join
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

    

      {/* Local Events Tab */}
      {activeTab === 1 && (
        <Box>
          <Grid container spacing={3}>
            {communityData.localEvents.map((event) => (
              <Grid item xs={12} md={6} key={event.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="start" mb={2}>
                      <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                        {event.type === "virtual" ? <VideocamIcon /> : <LocationOnIcon />}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6">{event.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {event.organizer}
                        </Typography>
                      </Box>
                      <Chip 
                        label={event.type}
                        size="small"
                        color={event.type === "virtual" ? "info" : "success"}
                      />
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={1}>
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {event.date} at {event.time}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {event.location}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                      {event.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {event.attendees}/{event.maxAttendees} attending
                      </Typography>
                      <Button variant="contained" size="small">
                        Join Event
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

     

      {/* Join Group Dialog */}
      <Dialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join WhatsApp Group</DialogTitle>
        <DialogContent>
          {selectedGroup && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedGroup.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedGroup.description}
              </Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                By joining this group, you agree to follow community guidelines and maintain respectful communication.
              </Alert>
              <TextField
                fullWidth
                label="Introduce yourself (optional)"
                multiline
                rows={3}
                placeholder="Hi everyone! I'm excited to join this community..."
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="success"
            startIcon={<WhatsAppIcon />}
            onClick={() => {
              // In real app, would open WhatsApp with group invite
              window.open(`https://wa.me/?text=I'd like to join ${selectedGroup?.name}`, '_blank');
              setJoinDialogOpen(false);
            }}
          >
            Join via WhatsApp
          </Button>
        </DialogActions>
      </Dialog>

      {/* Study Buddy Search Dialog */}
      <Dialog open={studyBuddyDialogOpen} onClose={() => setStudyBuddyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Find Study Buddies</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Career Path</InputLabel>
                <Select value={userInfo.careerPath} label="Career Path">
                  <MenuItem value="Full Stack Development">Full Stack Development</MenuItem>
                  <MenuItem value="Frontend Development">Frontend Development</MenuItem>
                  <MenuItem value="Backend Development">Backend Development</MenuItem>
                  <MenuItem value="Data Science">Data Science</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Skill Level</InputLabel>
                <Select value={userInfo.currentSkillLevel} label="Skill Level">
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select value={userInfo.location} label="Location">
                  <MenuItem value="Pretoria, Gauteng">Pretoria, Gauteng</MenuItem>
                  <MenuItem value="Johannesburg, Gauteng">Johannesburg, Gauteng</MenuItem>
                  <MenuItem value="Cape Town, Western Cape">Cape Town, Western Cape</MenuItem>
                  <MenuItem value="Durban, KwaZulu-Natal">Durban, KwaZulu-Natal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudyBuddyDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setStudyBuddyDialogOpen(false)}>
            Find Matches
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunityNetwork;