<template>
<!-- LAODING SPINNERS -->
<div class="d-flex justify-content-center spinner" v-if="state.loading">
  <div class="spinner-grow align-self-center text-primary" role="status"></div>
  <div class="spinner-grow align-self-center text-secondary" role="status"></div>
  <div class="spinner-grow align-self-center text-success" role="status"></div>
  <div class="spinner-grow align-self-center text-danger" role="status"></div>
  <div class="align-self-center mx-2">Checking Your Document ...</div>
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
import { useRouter } from 'vue-router';
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
    // const store = useStore();
    // const user = computed(() => store.state.User.user);
    const state = ref({
      error: '',
      user: user.value,
      loading: false,

    });
    const file = ref(null);

    async function upload() {
      if (file.value.files.length === 0) {
        state.value.error = 'Please submit a file!';
        return;
      }
      // console.log(file.value.files);
      state.value.loading = true;
      const form = new FormData();
      form.append('file', file.value.files[0]);
      form.append('user', state.value.user.email);
      form.append('name', state.value.user.name);
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
<style>

.spinner {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9)  center center no-repeat;
}

</style>
