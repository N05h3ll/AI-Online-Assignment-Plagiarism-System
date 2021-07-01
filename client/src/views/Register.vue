<template>
<!-- eslint-disable max-len -->
  <div class="container" id="middleContainer">
    <div class="row">
      <div class="col me-sm-3 align-self-center">
        <h2 class="h2 text-dark">AI Online Assignment Plagiarism System</h2>
        <p class="text-dark">
         Our anti-plagiarism engine comes with a reporting option which allows you to download a report of the plagiarism search you run.
         This means you now have some sort of evidence to send across to the relevant parties and a record to keep. Awesome!
         <br/>
         <span class="text-success">Join Us Today to Enjoy This Experience.</span>
        </p>
        <img class="img-fluid"
        src="../../public/Home-Image.png" style="max-height: 50vh;"/>
      </div>
      <div class="col rounded me-sm-3" id="registerationFormContanier">
        <h2 class="h2 m-3 text-dark">Create a new account</h2>
        <div class="alert alert-warning" role="alert" v-if='state.error'>
          {{state.error}}
        </div>
        <div class="alert alert-success" role="alert" v-if='state.success'>
          Account Registred Successfully
        </div>
        <form class="m-3"  @submit.prevent="register">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="Name"
              v-model="state.firstName"
              required
            />
            <label for="floatingInput">First name</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="Name"
              name="lastName"
              v-model="state.lastName"
              required
            />
            <label for="floatingInput">Last name</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              name="email"
              v-model="state.email"
              required
            />
            <label for="floatingInput">Email address</label>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Egypt (+20)</span>
             <input type="text" class="form-control" placeholder="Phone Number, 1xxxxxxxxx"
             aria-label="Username" aria-describedby="basic-addon1" maxlength="10" v-model="state.phone" required>
          </div>
          <div class="mb-3">
            <select
            class="form-select"
            aria-label="Account Type"
            name="accType"
            v-model="state.accType"
            >
              <option disabled value="">-- Account type --</option>
              <option>Module Coordinator</option>
              <option>Teacher Assistant</option>
              <option>Student</option>
              <option>Writer</option>
              <option>Revisor</option>
            </select>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="Institution Name"
              name="institution"
              v-model="state.institution"
              required
            />
            <label for="floatingInput">Institution</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control"
              id="floatingInput"
              placeholder="Password"
              name="password"
              v-model="state.password"
              required
            />
            <label for="floatingInput">Password</label>
          </div>
          <button type="submit" class="btn btn-success">Submit</button>
          <button type="reset" class="btn btn-outline-danger ms-sm-4">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { useRouter } from 'vue-router';

const User = computed(() => useStore().state.User.user);
export default {
  name: 'Register',
  mounted() {
    if (User.value) {
      const router = useRouter();
      router.push({ name: 'Home' });
    }
  },
  setup() {
    const state = ref({
      email: '',
      phone: '',
      password: '',
      accType: '',
      firstName: '',
      lastName: '',
      institution: '',
      error: '',
      success: null,
    });
    const router = useRouter();
    function register() {
      const registerData = new URLSearchParams();
      registerData.append('firstName', state.value.firstName);
      registerData.append('lastName', state.value.lastName);
      registerData.append('email', state.value.email);
      // eslint-disable-next-line prefer-template
      registerData.append('phone', '+20' + state.value.phone);
      registerData.append('accType', state.value.accType);
      registerData.append('institution', state.value.institution);
      registerData.append('password', state.value.password);
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      axios.post(`${process.env.VUE_APP_BACKENDURL}/api/user/register`, registerData, config).then(async () => {
        state.value.success = true;
        await setTimeout(() => {
          router.push({ name: 'Login' });
        }, 3000);
      }).catch((error) => {
        state.value.error = error.response.data.error;
      });
    }
    return {
      state,
      register,
    };
  },
};
</script>
