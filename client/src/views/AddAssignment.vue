<template>
<div>
<div class="container" id="middleContainer">
    <div class="row">
        <div class="col rounded me-sm-3" id="registerationFormContanier">
            <h2 class="h2 m-3 text-dark">Create a new assignment</h2>
     <div class="alert alert-warning" role="alert" v-if='state.error'>
      {{state.error}}
    </div>
    <div class="alert alert-success" role="alert" v-if='state.response'>
      {{state.response}}
    </div>
            <form class="m-3" @submit.prevent="allocate">
            <div class="form-floating mb-3">
                <input type="text"
                class="form-control" id="floatingInput" placeholder="name@example.com"
                v-model="state.name" required>
                <label for="floatingInput">Assignment name</label>
            </div>

            <div class="form-floating mb-3">
                <input type="date" class="form-control" id="floatingInput"
                v-model="state.date" v-bind:min="new Date().toISOString().split('T')[0]"
                required>
                <label for="floatingInput">Due date</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text"
                class="form-control" id="floatingInput" placeholder="SW2-Assignment1"
                v-model="state.customID">
                <label for="floatingInput">Custom ID (Optional)</label>
            </div>
            <div class="form-floating mb-3">
                <editor
                api-key="vuam4eijisek92cj77y6nznr8rd2o6yztacofl7jq3xteiov"
                output-format="html"
                v-model = "state.content"
                />
                <label for="floatingInput">Description</label>
            </div>
            <div v-html="state.content"></div>
            <button type="submit" class="btn btn-success">Create</button>
            <button type="reset" class="btn btn-outline-danger ms-sm-4">Cancel</button>
            </form>
        </div>
    </div>
</div>

</div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  components: {
    // eslint-disable-next-line quote-props
    'editor': Editor,
  },
  props: {
    courseID: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const store = useStore();
    const User = computed(() => store.state.User.user);
    const router = useRouter();
    const state = ref({
      User,
      content: null,
      name: null,
      date: null,
      customID: null,
      error: null,
      response: null,
      courseID: computed(() => {
        if (props.courseID) {
          return props.courseID;
        }
        // eslint-disable-next-line no-underscore-dangle
        return store.state.Course.course._id;
      }),
    });
    function allocate() {
      const assigmentDate = new URLSearchParams();
      assigmentDate.append('name', state.value.name);
      assigmentDate.append('dueDate', state.value.date);
      if (state.value.customID) assigmentDate.append('code', state.value.customID);
      assigmentDate.append('description', state.value.content);
      // eslint-disable-next-line no-underscore-dangle
      assigmentDate.append('authorID', state.value.User._id);
      assigmentDate.append('authorName', state.value.User.name);
      assigmentDate.append('courseID', state.value.courseID);
      assigmentDate.append('authorInstitution', state.value.User.institution);
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      axios.post('http://127.0.0.1:3000/api/assignment/addassignment', assigmentDate, config).then(async (res) => {
        state.value.error = null;
        state.value.response = res.data;
        await setTimeout(() => {
          router.push({ name: 'Home' });
        }, 3000);
      }).catch((error) => {
        state.value.error = error.response.data;
      });
    }

    return {
      state,
      allocate,
    };
  },
};
</script>
