# EduSync - Learning Management System

A comprehensive Learning Management System (LMS) mobile application built with React Native and Expo Router.

## 🚀 Features

### ✅ Authentication & User Dashboard
- **Student Login Screen** with secure token handling and form validation
- **Student Dashboard** with profile info and enrolled programs list
- **Demo Login** functionality for testing

### 📚 Program & Courses Module
- **Program Screen**: List of available/enrolled programs with progress tracking
- **Courses Screen**: Registered courses for each program with detailed information
- **Course Detail Screen**: Course outline with topics and materials

### 📁 Materials Library
- **Materials Screen**: Display all downloadable materials
- **File Viewer Component**: Support for PDF, PPT, DOCX, MP4, etc.
- **Download functionality** with progress tracking

### 📝 Assignments Module
- **Assignment List**: View assignments under each course/topic
- **File Upload**: Support for PDF, DOC, image submissions
- **Comments/Notes**: Add notes with submissions
- **Grade Tracking**: View grades and instructor feedback

### 🎬 Video Lectures
- **Video Player**: Pre-recorded video player with custom controls
- **Playback Controls**: Play, pause, rewind, fast-forward
- **Progress Tracking**: Video progress and time display

### 🧪 Online Exam Module
- **Exam Screen**: Timer-based exam interface
- **Question Navigation**: Navigate between questions
- **Auto-submit**: Automatic submission on time expiry
- **Question Types**: Support for Multiple Choice and True/False
- **Security**: App switching warnings and time restrictions

### 🔗 Backend Integration
- **REST API**: Axios-based API integration with baseURL setup
- **Token Authentication**: Secure token-based authentication using AsyncStorage
- **API Endpoints**: Complete API structure for all features

## 🏗️ Project Structure

```
/app
  /(auth)
    login.js                    # Authentication screen
  /(tabs)
    dashboard.js                # Student dashboard
    programs.js                 # Programs listing
    courses.js                  # Courses listing
    materials.js                # Materials library
    assignments.js              # Assignments management
    exams.js                    # Online exams
  /components
    Header.js                   # Reusable header component
    Button.js                   # Custom button component
    Card.js                     # Card layout component
    FileViewer.js               # File display and download
    Timer.js                    # Timer component for exams
  /utils
    api.js                      # API configuration and methods
    auth.js                     # Authentication utilities
  video-lecture.js              # Video player screen
/assets
  /videos                      # Video assets
  /images                      # Image assets
/constants
  colors.js                     # Color scheme definitions
  routes.js                     # Navigation routes
  dummyData.js                  # Mock data for development
```

## 🛠️ Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo Router**: File-based navigation
- **Expo AV**: Video and audio playback
- **Axios**: HTTP client for API calls
- **AsyncStorage**: Local data persistence
- **Expo File System**: File operations
- **Expo Document Picker**: File selection
- **Expo Media Library**: Media file management

## 📱 Screenshots

### Authentication
- Login screen with form validation
- Demo login functionality

### Dashboard
- Welcome section with user info
- Enrolled programs with progress
- Quick action buttons

### Programs
- Program listing with filters
- Progress tracking
- Enrollment status

### Courses
- Course listing by program
- Course details and progress
- Topic navigation

### Materials
- File library with categories
- Download functionality
- File type support

### Assignments
- Assignment listing
- Submission status
- Grade tracking

### Exams
- Exam listing with timer
- Question navigation
- Auto-submission

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edusync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 🔧 Configuration

### API Configuration
Update the API base URL in `constants/routes.js`:
```javascript
export const API_ENDPOINTS = {
  BASE_URL: 'https://your-api-domain.com/v1',
  // ... other endpoints
};
```

### Authentication
The app uses token-based authentication. Update authentication logic in `app/utils/auth.js` as needed.

## 📊 Dummy Data

The app includes comprehensive dummy data for development:
- User profiles
- Programs and courses
- Materials and files
- Assignments and submissions
- Exams and questions

## 🎨 UI Components

### Reusable Components
- **Header**: Navigation header with back button and actions
- **Button**: Customizable button with variants (primary, secondary, outline, danger)
- **Card**: Content container with shadow and padding
- **FileViewer**: File display with download and view actions
- **Timer**: Countdown timer with warnings

### Color Scheme
- Light and dark mode support
- Consistent color palette
- Accessibility-friendly contrast ratios

## 🔐 Security Features

- Token-based authentication
- Secure token storage
- API request/response interceptors
- Automatic token refresh
- Session management

## 📱 Platform Support

- **iOS**: Full support with native components
- **Android**: Full support with Material Design
- **Web**: Basic support (limited video functionality)

## 🚧 Future Enhancements

- [ ] Push notifications
- [ ] Offline mode
- [ ] Real-time chat
- [ ] Video conferencing
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Accessibility improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**EduSync** - Empowering education through technology
