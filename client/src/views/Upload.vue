<template>
<!-- LAODING SPINNERS -->
<div class="spinner "  v-if="state.loading">
<div class="d-flex justify-content-center">
  <div id="carouselExampleSlidesOnly" class="carousel slide mt-3" data-bs-ride="carousel">
  <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active" data-bs-interval="5000">
      <img src="../../public/11.jpg" class="d-block" alt="...">
      <div class="carousel-caption d-none d-md-block bg-dark">
        <h5>Why use Plagiarism checkers?</h5>
        <p>Educates students on identifying and acknowledging other authors work.</p>
      </div>
    </div>
    <div class="carousel-item" data-bs-interval="5000">
      <img src="../../public/12.jpg" class="d-block" alt="...">
      <div class="carousel-caption d-none d-md-block bg-dark">
        <h5>Why use Plagiarism checkers?</h5>
        <p>There can be many matches because of extensive duplications of material on the web.
          The source named may not be the exact source that the student used.</p>
      </div>
    </div>
    <div class="carousel-item" data-bs-interval="5000">
      <img src="../../public/15.jpg" class="d-block" alt="...">
      <div class="carousel-caption d-none d-md-block bg-dark">
        <h5>Why use Plagiarism checkers?</h5>
        <p>The similarity score is just a
          percentage of material in the paper that matches sources in the internet and Database.</p>
      </div>
    </div>
  </div>
  <a class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
  data-bs-slide="prev" role="button">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </a>
  <a class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
  data-bs-slide="next" role="button">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </a>
</div>
  </div>
</div>
  <div class="d-flex justify-content-center mt-2">
   <div class="spinner-grow align-self-center text-primary" role="status"></div>
  <div class="spinner-grow align-self-center text-secondary" role="status"></div>
  <div class="spinner-grow align-self-center text-success" role="status"></div>
  <div class="spinner-grow align-self-center text-danger" role="status"></div>
  <div class="align-self-center mx-2">PLease wait, while checking your document ...</div>
  </div>
</div>
<!-- END LOADING SPINNERS -->
  <div class="container" id="middleContainer">
    <div class="row">
      <div class="col rounded me-sm-3" id="registerationFormContanier">
        <h2 class="h2 m-3 text-dark">Upload Your File</h2>
        <div class="alert alert-warning" role="alert" v-if='state.error'>
          {{state.error}}
        </div>
        <form class="m-3" @submit.prevent="upload">
          <div>
            <label for="formFileLg" class="form-label"></label>
            <input class="form-control form-control-lg" id="formFileLg" ref="file" type="file" />
          </div>
          <div class="container mt-5">
            <div class="d-grid gap-2 col-6 mx-auto">
              <button class="btn btn-primary" type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

// const store = useStore();
// const store = useStore();
const user = computed(() => useStore().state.User.user);

export default {
  name: 'Upload',
  mounted() {
    if (!user.value) {
      const router = useRouter();
      router.push('login');
    }
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const state = ref({
      error: '',
      user: user.value,
      loading: false,
      Assignment: computed(() => store.state.Assignment.singleAssignment),
    });
    console.log(state.value.Assignment.data);
    const file = ref(null);
    async function upload() {
      if (file.value.files.length === 0) {
        state.value.error = 'Please submit a file!';
        return;
      }
      state.value.loading = true;
      const form = new FormData();
      form.append('file', file.value.files[0]);
      form.append('user', state.value.user.email);
      form.append('name', state.value.user.name);
      form.append('assignmentID', route.params.assid);
      form.append('courseID', route.params.cID);
      form.append('assignmentName', state.value.Assignment.data.name);
      form.append('assignmentCode', state.value.Assignment.data.code);
      axios.post('http://127.0.0.1:5000', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(() => {
        state.value.loading = false;
        console.log('done');
      }).catch((error) => { console.log(error); });
    }
    return {
      upload,
      file,
      state,
    };
  },
};
</script>
