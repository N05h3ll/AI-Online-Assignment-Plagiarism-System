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
import moduleCoordinatorAssignments from '../views/moduleCoordinatorAssignments.vue';

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
    path: "/upload/:assid",
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
    path: "/Assignment/:assid",
    name: 'Assignment',
    component: Assignment,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
