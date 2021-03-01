<template>
<div class="container" id="middleContainer">
    <div class="row">
        <div class="col rounded me-sm-3" id="registerationFormContanier">
            <h2 class="h2 m-3 text-dark">Create a new Course</h2>
            <div class="alert alert-warning" role="alert" v-if='state.error'>
          {{state.error}}
        </div>
        <div class="alert alert-success" role="success" v-if='state.success'>
          {{state.success}}
        </div>
            <form class="m-3" @submit.prevent="addCourse">
            <div class="form-floating mb-3">
                <input type="text"
                class="form-control" id="floatingInput" placeholder="Course Name"
                v-model="state.courseName" required>
                <label for="floatingInput">Course name</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text"
                class="form-control" id="floatingInput" placeholder="Assignment Code"
                v-model="state.courseCode">
                <label for="floatingInput">Custom ID (Optional)</label>
            </div>

          <div class="form-floating mb-3">
            <Multiselect
            class="bg-white rounded"
                  v-model="state.TAs"
                  mode="tags"
                  placeholder="Teacher Assistants"
                  :options="state.options"
                  label="name"
                  id="floatingInput"
                >
<template v-slot:singleLabel="{ value }">
        {{ value.name }}
      </template>
      <template v-slot:option="{ option }">
        {{ option.name }}
      </template>
            </Multiselect>
          </div>
          <div class="form-floating mb-3">
              <input type="number" class="form-control" id="floatingInput"
              min="1" max="250"
              placeholder="Students Capacity (1~250)" v-model="state.courseCapacity" required>
              <label for="floatingInput">Students Capacity (1~250)</label>
            </div>
            <button type="submit" class="btn btn-success"
            v-if="!state.listOfTAsError">Create</button>
            <button type="submit" class="btn btn-secondary" disabled
            v-if="state.listOfTAsError">Create</button>
            <button type="reset" class="btn btn-outline-danger ms-sm-4">Cancel</button>
            </form>
        </div>
    </div>
</div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Multiselect from '@vueform/multiselect';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  components: {
    Multiselect,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = ref({
      user: computed(() => store.state.User.user),
      listOfTAsError: null,
      courseName: null,
      customID: null,
      courseCapacity: null,
      TAs: null,
      options: null,
      error: null,
      success: null,
    });
    if (!state.value.user || state.value.user.accType !== 'Module Coordinator') {
      router.push({ name: 'Home' });
    }
    axios.get('http://127.0.0.1:3000/api/user/gettas').then((response) => {
      console.log(response.data);
      // eslint-disable-next-line arrow-body-style
      state.value.options = response.data.map((x) => {
        // eslint-disable-next-line quotes
        // eslint-disable-next-line no-underscore-dangle
        return { name: `${x.name}, ${x.email}`, value: x._id };
      });
    }).catch((error) => {
      state.value.listOfTAsError = error.response.data;
      state.value.error = error.response.data;
    });
    function addCourse() {
      state.value.error = null;
      state.value.listOfTAsError = null;
      const courseData = {
        courseName: state.value.courseName,
        courseCode: state.value.courseCode,
        courseCapacity: state.value.courseCapacity,
        TAs: state.value.TAs,
        courseInstitution: state.value.user.institution,
        createdOn: new Date().toLocaleDateString(),
        // eslint-disable-next-line no-underscore-dangle
        creator: state.value.user._id,
      };
      console.log(JSON.stringify(courseData));
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      axios.post('http://127.0.0.1:3000/api/course/addcourse', courseData, config).then(async (response) => {
        state.value.success = response.data;
        await setTimeout(() => {
          router.push({ name: 'Home' });
        }, 3000);
      }).catch((error) => {
        state.value.error = error.response.data;
      });
    }
    return {
      state,
      addCourse,
    };
  },
};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
