/* eslint-disable quotes */
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import AddAssignment from '../views/AddAssignment.vue';
import Upload from '../views/Upload.vue';
import Report from '../views/Report.vue';
import Assignment from '../views/Assignment.vue';
import addCourse from '../views/addCourse.vue';
import Course from '../views/Course.vue';
import Help from '../views/Help.vue';
import moduleCoordinatorAssignments from '../views/moduleCoordinatorAssignments.vue';
import STUHelp from '../views/STUHelp.vue';
import TAHelp from '../views/TAHelp.vue';
import MCHelp from '../views/MCHelp.vue';
import Profile from '../views/Profile.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/upload/:cID/:ST/:assid",
    name: "Upload",
    component: Upload,
  },
  {
    path: "/report/:repid",
    name: 'Report',
    component: Report,
  },
  {
    path: "/AddAssignment",
    name: 'AddAssignment',
    component: AddAssignment,
    props: true,
  },
  {
    path: "/course/:cID/Assignment/:assid",
    name: 'Assignment',
    component: Assignment,
    props: true,
  },
  {
    path: "/addCourse",
    name: 'addCourse',
    component: addCourse,
  },
  {
    path: "/course/:cID",
    name: 'Course',
    component: Course,
  },
  {
    path: "/course/assignments",
    name: 'courseAssignments',
    component: moduleCoordinatorAssignments,
    props: true,
  },
  {
    path: "/help",
    name: 'Help',
    component: Help,
  },
  {
    path: "/help/student",
    name: 'Student Help',
    component: STUHelp,
  },
  {
    path: "/help/TeacherAssistant",
    name: 'TA Help',
    component: TAHelp,
  },
  {
    path: "/help/ModuleCoordinator",
    name: 'MC Help',
    component: MCHelp,
  },
  {
    path: "/user/:uID",
    name: 'Profile',
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
