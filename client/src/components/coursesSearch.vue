<template>
<!-- SEARCH OVERLAY -->
<div
class="d-flex justify-content-center spinner"
v-if="state.user.accType === 'Student' && (state.searchResult || state.searchError)">
  <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
  <div class="align-self-center h1" v-if="state.searchError">{{ state.searchError }}</div>
    <div class="table-responsive mt-lg-5 w-100 overflow-scroll" v-if="state.searchResult">
      <div class="alert alert-danger" role="alert" v-if='state.enrolledFail'>
      Failed to enroll to the course please try again later ...
    </div>
    <div class="alert alert-success" role="alert" v-if='state.enrolledSuccess'>
      Enrolled successfully ...
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Code</th>
          <th scope="col">Author</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in state.searchResult" :key="result">
          <td>{{ result.courseName }}</td>
          <td>{{ result.courseCode }}</td>
          <td>{{ result.creator.name }}</td>
          <td>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="enrollCourse(result._id)"
            >
              Enroll
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<!-- END SEARCH OVERLAY -->
 <!--search box-->
    <div class="w-25 float-end row" v-if="state.user.accType === 'Student'">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Course"
          aria-label="Course"
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
</template>

<script>

import { computed, ref } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const state = ref({
      user: computed(() => store.state.User.user),
      query: null,
      searchResult: null,
      searchError: null,
    });

    function close() {
      state.value.searchResult = null;
      state.value.searchError = null;
    }
    function search() {
      if (state.value.query) {
        axios.post('http://127.0.0.1:3000/api/course/search',
          { query: state.value.query, institution: state.value.user.institution }).then((res) => {
          state.value.searchError = null;
          state.value.searchResult = res.data;
        }).catch((error) => {
          state.value.searchResult = null;
          state.value.searchError = error.response.data;
        });
      }
    }
    function enrollCourse(courseID) {
      axios.post(`http://127.0.0.1:3000/api/course/enroll/${courseID}`).then(async () => {
        state.value.enrolledSuccess = true;
        state.value.enrolledFail = false;
        await setTimeout(() => {
          close();
          state.value.enrolledSuccess = false;
          state.value.enrolledFail = false;
        }, 3000);
      }).catch(async () => {
        state.value.enrolledSuccess = false;
        state.value.enrolledFail = true;
        await setTimeout(() => {
          close();
          state.value.enrolledSuccess = false;
          state.value.enrolledFail = false;
        }, 3000);
      });
    }
    return {
      state,
      close,
      search,
      enrollCourse,
    };
  },
};

</script>
