<template>
<div
class="d-flex justify-content-center spinner"
v-if="(state.user.accType == 'Module Coordinator'
|| state.user.accType == 'Teacher Assistant')
&& (state.enrolledStudents || state.enrolledError)">
  <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
  <div class="align-self-center h1" v-if="state.enrolledError">
    No students enrolled yet, please share the course code with your students.</div>
    <div class="table-responsive mt-lg-5 w-100 overflow-scroll" v-if="state.enrolledStudents">
    <table class="table" id="enrolledTBL">
      <thead>
        <button
              type="button"
              v-bind:class="'btn btn-primary '+state.invisible"
              @click="genPDF('enrolledTBL', 'Report of Enrolled Students')"
            >
              Print Report
            </button>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">ID</th>
          <th scope="col">Email</th>
          <th scope="col">Phone Number</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in state.enrolledStudents" :key="student">
          <td>{{ student.name }}</td>
          <td>{{ student._id }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.phone }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div class="container rounded" id="registerationFormContanier">
      <table v-if="!state.loading" class="table table-bordered">
        <tr>
          <th><h5 class="h5">Course Name:  </h5></th>
          <th> <h5 class="h5 fw-bolder">{{state.course.courseName}}</h5>  </th>
        </tr>
        <tr>
          <td> <h5 class="h5">Course Code:  </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.course.courseCode}}</h5></td>
        </tr>
        <tr>
          <td><h5 class="h5">Created on:  </h5></td>
          <td><h5 class="h5 fw-bolder">
            {{state.course.createdOn.split("T")[0]}}</h5></td>
        </tr>
        <tr>
          <td><h5 class="h5">Created by: </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.course.creator.name}}</h5></td>
       </tr>
       <tr>
          <td><h5 class="h5">Teacher Assistants: </h5></td>
          <td>
            <h5 class="h5 fw-bolder">
              <ul>
              <li v-for="TA in state.course.TAs" :key="TA">{{TA.name}} , {{TA.email}}</li>
              </ul>
              </h5>
            </td>
       </tr>
       <tr>
          <td><h5 class="h5">Created Assignments: </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.course.assignments.length}}</h5></td>
       </tr>
       <tr>
          <td><h5 class="h5">Enrolled Students: </h5></td>
          <td>
            <h5 class="h5 fw-bolder">
              {{state.course.enrolledStudents.length}}/{{state.course.courseCapacity}}
            </h5></td>
       </tr>
      </table>

</div>
      <div class="text-center"><button class="btn m-3 btn-lg btn-primary"
      v-if="state.user.accType === 'Module Coordinator' || state.user.accType === 'Student'
      || state.user.accType === 'Teacher Assistant'"
      @click="getAssignments">View Assignments</button>
<button class="btn m-3 btn-lg btn-primary"
      v-if="state.user.accType === 'Module Coordinator'
      || state.user.accType === 'Teacher Assistant'"
      @click="getEnrolledStudents">View Enrolled Students</button>
    </div>
</template>

<script>
/* eslint-disable prefer-const */
import { computed, ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default {
  setup() {
    // eslint-disable-next-line global-require
    const img = require('./img.js');
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const state = ref({
      course: null,
      loading: true,
      user: computed(() => store.state.User.user),
      enrolledStudents: null,
      enrolledError: null,
    });
    axios.get(`${process.env.VUE_APP_BACKENDURL}/api/course/getcourse/${route.params.cID}`).then((response) => {
      state.value.course = response.data;
      store.dispatch('Course/setCourse', response.data);
      state.value.loading = false;
    }).catch(() => {
      router.push({ name: 'Home' });
    });
    function getEnrolledStudents() {
      if (state.value.course.enrolledStudents.length !== 0) {
        state.value.enrolledStudents = state.value.course.enrolledStudents;
      } else {
        state.value.enrolledError = true;
      }
    }
    function close() {
      state.value.enrolledStudents = null;
      state.value.enrolledError = null;
    }
    function getAssignments() {
      router.push({ name: 'courseAssignments', params: { course: JSON.stringify(state.value.course) } });
    }
    function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }
    function dsble() {
      state.value.invisible = 'invisible';
      sleep(2000);
    }
    async function genPDF(bodyID, text) {
      await dsble();
      window.scrollTo(0, 0);
      if (state.value.invisible) {
        html2canvas(document.getElementById(bodyID)).then((canvas) => {
          // eslint-disable-next-line new-cap
          let doc = new jsPDF();
          let imgData = canvas.toDataURL('image/png');
          let imgWidth = 208;
          let imgHeight = (canvas.height * imgWidth) / canvas.width;
          doc.addImage(img, 'PNG', 5, 5, 20, 15);
          doc.setFontSize(15);
          doc.text(text, 105, 30, 'center');
          doc.addImage(imgData, 'JPEG', 2, 37, imgWidth, imgHeight);
          doc.save(`${Date.now()}report.pdf`);
        });
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        state.value.invisible = null;
      }
    }
    return {
      state,
      getEnrolledStudents,
      close,
      getAssignments,
      genPDF,
    };
  },
};
</script>
