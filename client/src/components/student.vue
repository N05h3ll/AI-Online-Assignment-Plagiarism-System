<template>
<!-- SEARCH OVERLAY -->

<div
class="d-flex justify-content-center spinner"
v-if="state.user && (state.searchResult || state.searchError)">
  <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
  <div class="align-self-center h1" v-if="state.searchError">{{ state.searchError }}</div>
    <div class="table-responsive mt-lg-5 w-100 overflow-scroll" v-if="state.searchResult">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Code</th>
          <th scope="col">Due Date</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in state.searchResult" :key="result">
          <td>{{ result.name }}</td>
          <td>{{ result.code }}</td>
          <td>{{ result.dueDate.split("T")[0] }}</td>
          <td>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="getAssignment(result._id)"
            >
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<!-- END SEARCH OVERLAY -->
 <!--search box-->
    <div class="w-25 float-end row">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Assigment"
          aria-label="Assigment"
          aria-describedby="basic-addon1"
          v-model="state.query"
        />
        <span class="btn btn-secondary" id="basic-addon1"
          @click="search"><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397
              1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007
              1.007 0 0 0-.115-.1zM12
              6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
            /></svg
        ></span>
      </div>
    </div>
    <!--/search box-->

    <!-- STUDENT -->
    <div class="container row" id="middleContainer">
      <div class="row">
        <div class="container">
          <div class="row align-items-center">
            <div class="col">
              <div class="d-grid gap-3 col-5 ">
                <button
                  v-bind:class="'btn btn-lg '+ state.reportButtonClass"
                  type="button"
                  @click="toggleReports"
                >
                  Reports
                </button>
                <button
                  v-bind:class="'btn btn-lg '+ state.assignmentButtonClass"
                  type="button"
                  @click="toggleAssignments"
                >
                  Assigment
                </button>
              </div>
            </div>
            <div class="col rounded me-sm-3" id="registerationFormContanier">
              <h2 class="h2 m-3 text-dark">{{state.titleState}}</h2>
              <div class="table-responsive overflow-scroll" v-if="state.titleState == 'Reports'">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Code</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="report in state.listOfReports" :key="report">
                      <td>A340 Survey</td>
                      <td>SW125-Assignemnt2</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          @click="getReports(report._id)"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          <router-link :to="{ name: 'Upload' }">
    <button class="btn btn-success float-end m-lg-5">Upload New Document</button>
    </router-link>
          </div>
      </div>
    </div>

</template>

<script>
import { computed, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  props: {
    user: {
      required: true,
      type: Object,
    },
    listOfReports: {
      required: true,
      type: Array,
    },
  },
  setup(props) {
    const router = useRouter();
    const state = ref({
      user: computed(() => props.user),
      listOfReports: computed(() => props.listOfReports),
      assignmentButtonClass: 'btn-warning',
      reportButtonClass: 'btn-primary',
      titleState: 'Assignments',
      query: null,
      searchResult: null,
      searchError: null,
    });
    function close() {
      state.value.searchResult = null;
      state.value.searchError = null;
    }
    function toggleAssignments() {
      state.value.assignmentButtonClass = 'btn-warning';
      state.value.reportButtonClass = 'btn-primary';
      state.value.titleState = 'Assignments';
    }
    function toggleReports() {
      state.value.assignmentButtonClass = 'btn-primary';
      state.value.reportButtonClass = 'btn-warning';
      state.value.titleState = 'Reports';
    }
    function search() {
      if (state.value.query) {
        axios.post('http://127.0.0.1:3000/api/assignment/search',
          { query: state.value.query, institution: state.value.user.institution }).then((res) => {
          state.value.searchError = null;
          state.value.searchResult = res.data;
        }).catch((error) => {
          state.value.searchResult = null;
          state.value.searchError = error.response.data;
        });
      }
    }
    function getAssignment(assignmentID) {
      // console.log(assignmentID);
      router.push({ name: 'Assignment', params: { assid: assignmentID } });
    }
    return {
      state,
      toggleAssignments,
      toggleReports,
      search,
      close,
      getAssignment,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 50vh;
}
</style>
