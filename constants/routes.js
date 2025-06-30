export const ROUTES = {
  // Auth routes
  LOGIN: '/(auth)/login',
  
  // Tab routes
  DASHBOARD: '/(tabs)/dashboard',
  PROGRAMS: '/(tabs)/programs',
  COURSES: '/(tabs)/courses',
  MATERIALS: '/(tabs)/materials',
  ASSIGNMENTS: '/(tabs)/assignments',
  EXAMS: '/(tabs)/exams',
  
  // Stack routes
  COURSE_DETAIL: '/course-detail',
  ASSIGNMENT_DETAIL: '/assignment-detail',
  EXAM_DETAIL: '/exam-detail',
  VIDEO_LECTURE: '/video-lecture',
  PROFILE: '/profile',
};

export const API_ENDPOINTS = {
  BASE_URL: 'https://api.edusync.com/v1',
  
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User
  PROFILE: '/user/profile',
  
  // Programs
  PROGRAMS: '/programs',
  PROGRAMS_ENROLLED: '/programs/enrolled',
  
  // Courses
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  COURSE_MATERIALS: '/courses/:id/materials',
  
  // Materials
  MATERIALS: '/materials',
  MATERIAL_DOWNLOAD: '/materials/:id/download',
  
  // Assignments
  ASSIGNMENTS: '/assignments',
  ASSIGNMENT_SUBMIT: '/assignments/:id/submit',
  
  // Exams
  EXAMS: '/exams',
  EXAM_START: '/exams/:id/start',
  EXAM_SUBMIT: '/exams/:id/submit',
}; 