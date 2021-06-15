<template>
  <div class="bg-white h-full">
    <LoginBox v-if="!user"/>
    <Profile v-else/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import {namespace} from "vuex-class"
import {User} from "@/types/entity/User"
import LoginBox from "@/apps/userManage/children/LoginBox.vue"
import Profile from "@/apps/userManage/children/Profile.vue"

const UserModule = namespace("user")
@Component({
  components: {Profile, LoginBox}
})
export default class UserManage extends Vue {
  @UserModule.State user!: User

}
</script>

<style scoped lang="scss">

</style>
