<template>
<!-- eslint-disable max-len -->
<div class="d-flex justify-content-center spinner"
v-if="state.loading">
<div class="align-self-center h1">
    Loading ...</div>
</div>
<div
class="d-flex justify-content-center spinner"
v-if="(state.user.accType == 'Module Coordinator'
|| state.user.accType == 'Teacher Assistant')
&& (state.submittedStudents || state.submissionError) && !state.loading">
  <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
  <div class="align-self-center h1" v-if="state.submissionError">{{ state.submissionError }}</div>
    <div class="table-responsive mt-lg-5 w-100 overflow-scroll" v-if="state.submittedStudents">
    <table class="table" id="tbl">
      <thead>
      <h3 class="text-center">Total Submissions: {{state.submittedStudents.length}}</h3>
              <button
              type="button"
              v-bind:class="'btn btn-primary btn-sm '+state.invisible"
              @click="genPDF('tbl', 'Report of Submitted Students')"
            >
              Print Report
            </button>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Submission Date</th>
          <th scope="col">Status</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in state.submittedStudents" :key="student">
          <td>{{ student.studentdName }}</td>
          <td>{{ student.submissionDate.split("T")[0] }}</td>
          <td class="badge bg-success mt-sm-2"
          v-if="student.status == 'Passed'">{{ student.status }}</td>
          <td class="badge bg-danger mt-sm-2"
          v-if="student.status == 'Failed'">{{ student.status }}</td>
          <td class="badge bg-warning text-dark mt-sm-2"
          v-if="student.status == 'Second Trial'">Second Trial Allowed</td>
          <td class="badge bg-primary mt-sm-2 mx-sm-1"
          v-if="student.status !== 'Second Trial' &&
          student.reportID.isSecondTrial">Second Trial</td>
          <td class="badge bg-secondary mt-sm-2 text-white mx-sm-1"><span class=""> Current Percentage: </span>{{student.reportID.totalPercentage.$numberDecimal.slice(0,5)}} %</td>
          <td class="badge bg-info text-dark mt-sm-2 mx-sm-1"
          v-if="student.status !== 'Second Trial' &&
          student.reportID.isSecondTrial && student.reportID.previousPercentage">
          Previous Percentage: {{student.reportID.previousPercentage.$numberDecimal.slice(0,5)}} %</td>
          <td>
            <button
              type="button"
              v-bind:class="'btn btn-primary btn-sm '+state.invisible"
              @click="getReport(student.reportID._id)"
            >
              View Report
            </button>
          </td>
          <td>
            <button
              v-if="student.status === 'Failed' && state.user.accType === 'Teacher Assistant' &&
              !student.reportID.isSecondTrial && !student.reportID.previousPercentage"
              type="button"
              class="btn btn-success btn-sm"
              @click="allowSecondTrial(student.studentdID, student.reportID._id)"
            >
              Allow Second Trial
            </button>
            <button
            v-if="student.status === 'Second Trial' && state.user.accType === 'Teacher Assistant' &&
            student.reportID.status === 'Second Trial' && !student.reportID.isSecondTrial"
              type="button"
              class="btn btn-secondary btn-sm disabled"
              @click="allowSecondTrial(student.studentdID, student.reportID._id)"
            >
              Allow Second Trial
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div class="container rounded" id="registerationFormContanier"
v-if="!state.loading" ref="crs">
      <table>
        <h2 class="h2 m-3 text-dark">Course: {{state.course.courseName}}</h2>
        <tr>
          <th><h5 class="h5">Assignment Name:  </h5></th>
          <th> <h5 class="h5 fw-bolder">{{state.Assignment.data.name}}</h5>  </th>
        </tr>
        <tr>
          <td> <h5 class="h5">Assignment Code:  </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.Assignment.data.code}}</h5></td>
        </tr>
        <tr>
          <td><h5 class="h5">Assignment Due Date:  </h5></td>
          <td><h5 class="ms-3 h5 fw-bolder">
            {{state.Assignment.data.dueDate.split("T")[0]}}</h5></td>
        </tr>
        <tr>
          <td><h5 class="h5">Author: </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.Assignment.data.authorName}}</h5></td>
       </tr>
      </table>
      <hr v-if="!state.submittedStudents">
      <hr v-if="!state.submittedStudents">
    <div v-html="state.Assignment.data.description" class="row fs-5"></div>
      <div class="row"><button class="btn btn-success"
      v-if="state.user.accType == 'Student'
      && !state.submitted" @click="submit">Submit</button>
      <h3 class="alert alert-warning"
      v-if="state.submitted &&
      state.user.accType == 'Student'">You have already submitted this assignemnt.</h3>
      </div>
      <div v-bind:class="'row '+state.invisible"><button class="btn btn-primary"
      v-if="state.user.accType == 'Module Coordinator' || state.user.accType == 'Teacher Assistant'"
      @click="getSubmittedStudents">View Submitted Students</button></div>
      <div v-bind:class="'row mt-1 '+state.invisible"><button class="btn btn-danger"
      v-if="state.user.accType == 'Module Coordinator'"
      @click="delAssignment(state.Assignemnt.data._id)">Delete Course</button></div>
      <div v-bind:class="'row mt-1 '+state.invisible" v-if="state.user.accType == 'Module Coordinator' || state.user.accType == 'Teacher Assistant'"
      ><button
              type="button"
              class="btn btn-primary"
              @click="genPDF('registerationFormContanier', 'Assignment Details')"
            >
              Print Report
            </button></div>
    </div>
</template>

<script>
/* eslint-disable prefer-const */
/* eslint-disable max-len */
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ref, computed } from 'vue';

const Assignment = computed(() => useStore().state.Assignment.singleAssignment);
export default {
  inheritAttrs: false,
  props: {
    course: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    // eslint-disable-next-line global-require
    const img = require('./img.js');
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const state = ref({
      Assignment,
      course: computed(() => {
        if (props.course) { return JSON.parse(props.course); }
        return store.state.Course.course;
      }),
      user: computed(() => store.state.User.user),
      submittedStudents: null,
      submissionError: null,
      submitted: null,
      loading: true,
      invisible: null,
    });
    axios.get(`${process.env.VUE_APP_BACKENDURL}/api/assignment/getassignment/${route.params.assid}`).then((assignment) => {
      store.dispatch('Assignment/setAssignment', assignment);
      state.value.loading = false;
    });
    axios.get(`${process.env.VUE_APP_BACKENDURL}/api/assignment/${route.params.assid}/issubmitted`).then(() => {
      state.value.submitted = true;
    }).catch(() => {
      state.value.submitted = false;
    });
    function close() {
      state.value.submittedStudents = null;
      state.value.submissionError = null;
    }
    function submit() {
      // eslint-disable-next-line no-underscore-dangle
      const secondTrial = state.value.Assignment.data.submittedStudents.map((x) => x.studentdID).includes(state.value.user._id);
      // eslint-disable-next-line no-underscore-dangle
      router.push({ name: 'Upload', params: { assid: state.value.Assignment.data._id, ST: secondTrial, cID: state.value.course._id } });
    }
    function getSubmittedStudents() {
      state.value.loading = true;
      // eslint-disable-next-line no-underscore-dangle
      axios.get(`${process.env.VUE_APP_BACKENDURL}/api/assignment/${route.params.assid}/getsubmittedstudents`).then((subStudents) => {
        const secondTrialStudents = subStudents.data.filter((x) => x.status === 'Second Trial');
        const notSecondTrialStudents = subStudents.data.filter((x) => x.status !== 'Second Trial');
        const difference = secondTrialStudents.filter((y) => !notSecondTrialStudents.some((i) => i.studentdID === y.studentdID));
        state.value.submittedStudents = notSecondTrialStudents.concat(difference);
        state.value.submissionError = null;
        state.value.loading = false;
      }).catch((error) => {
        state.value.submittedStudents = null;
        state.value.submissionError = error.response.data;
        state.value.loading = false;
      });
    }
    function getReport(repID) {
      router.push({ name: 'Report', params: { repid: repID } });
    }
    function allowSecondTrial(stuID, repID) {
      axios.get(`${process.env.VUE_APP_BACKENDURL}/api/assignment/${route.params.assid}/allow/${stuID}/rep/${repID}`).then(
        state.value.submittedStudents = null,
        axios.get(`${process.env.VUE_APP_BACKENDURL}/api/assignment/${route.params.assid}/getsubmittedstudents`).then(async (subStudents) => {
          await setTimeout(() => { state.value.submittedStudents = subStudents.data; }, 500);
          state.value.submissionError = null;
        }).catch((error) => {
          state.value.submittedStudents = null;
          state.value.submissionError = error.response.data;
        }),
      );
    }
    function delAssignment(aid) {
      axios.delete(`${process.env.VUE_APP_BACKENDURL}/api/assignment/delete/${aid}`);
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
      submit,
      close,
      getSubmittedStudents,
      getReport,
      allowSecondTrial,
      delAssignment,
      genPDF,
    };
  },
};
</script>
