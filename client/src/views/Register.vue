<template>
  <div class="container" id="middleContainer">
    <div class="row">
      <div class="col me-sm-3 align-self-center">
        <h2 class="h2 text-white">AI Online Assignment Plagiarism System</h2>
        <p class="text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget eros sapien.
          Pellentesque vulputate sed ligula quis dapibus. Proin varius metus ac lorem egestas, id
          aliquam eros dapibus. Aliquam tempus sem ut sem pellentesque, id varius turpis vulputate.
          Proin malesuada sit amet neque nec hendrerit. Phasellus eu tortor lorem. Fusce vehicula
          efficitur ultrices.
        </p>
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
      registerData.append('accType', state.value.accType);
      registerData.append('institution', state.value.institution);
      registerData.append('password', state.value.password);
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      axios.post('http://127.0.0.1:3000/api/user/register', registerData, config).then(async () => {
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
