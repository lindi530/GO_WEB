<template>
  <aside class="col-md-3 mb-4">
    <div class="card shadow-sm">
      <div class="card-body text-center">
        <img
          :src="previewAvatar || userAvatar"
          alt="Avatar"
          class="rounded-circle mb-3"
          width="100"
          height="100"
          @click="triggerFileInput"
          style="cursor: pointer"
        >
        <input type="file" ref="fileInput" class="d-none" @change="handleAvatarChange" accept="image/*" />

        <h5 class="card-title">{{ userName }}</h5>
        <p class="text-muted">{{ userEmail }}</p>
        <p>Joined: {{ formattedDate(createTime) }}</p>
      </div>
    </div>
  </aside>
</template>


<script>
import api from '@/api';

export default {
  name: 'UserInfo',
  data() {
    return {
      previewAvatar: null // 本地预览头像
    }
  },
  computed: {
    userId() {
      return this.$store.getters['user/userId']
    },
    userAvatar() {
      return this.$store.getters['user/userAvatar']
    },
    createTime() {
      return this.$store.getters['user/createTime'];
    },
    userEmail() {
      return this.$store.getters['user/userEmail'];
    },
    userName() {
      return this.$store.getters['user/userName'];
    }
  },
  methods: {
    formattedDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.previewAvatar = URL.createObjectURL(file);
        // ✅ 此处可添加上传逻辑，比如 this.uploadAvatar(file)
        this.uploadAvatar(file);
      } else {
        this.$message.error('请选择有效的图片文件');
      }
    },
    async uploadAvatar(file) {
      try {
         // 1. 创建FormData对象
        const formData = new FormData();
        formData.append('avatar', file);  // 'avatar'是后端接收的字段名
        // 可以添加其他表单数据
        // formData.append('userId', this.userId);
        this.uploading = true;
        const response = await api.upLoadAvatar(this.userId, formData)

        console.log(response);
        
      } catch {
          console.error('上传出错:', error);
          this.$message.error('上传过程中出现错误');
      }
    }
  }
}
</script>