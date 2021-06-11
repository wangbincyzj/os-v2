<template>
  <div class="bg-white h-full">
    <LoginBox v-if="!user"/>
    <div v-else>
      <div>您已登陆</div>
      <div>{{user.trueName || user.username}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import {namespace} from "vuex-class"
import {User} from "@/types/entity/User"
import LoginBox from "@/apps/userManage/children/LoginBox.vue"

const UserModule = namespace("user")
@Component({
  components: {LoginBox}
})
export default class UserManage extends Vue {
  @UserModule.State user!: User

}
</script>

<style scoped lang="scss">

</style>
