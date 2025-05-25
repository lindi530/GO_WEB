<template>
  <div class="row">
    <aside class="col-md-4 mb-4">
      <div class="card">
        <div class="card-body d-flex align-items-center">
          <img :src="user.avatar" alt="avatar" class="rounded-circle me-3" width="60" height="60" />
          <h5 class="card-title mb-0">{{ user.username }}</h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">关注数: <strong>{{ user.following }}</strong></li>
          <li class="list-group-item">粉丝数: <strong>{{ user.followers }}</strong></li>
          <li class="list-group-item">阅读量: <strong>{{ user.views }}</strong></li>
        </ul>
      </div>
    </aside>

    <main class="col-md-8">
      <div
        class="card mb-3"
        v-for="(post, index) in posts"
        :key="index"
      >
        <div class="card-header fw-bold">{{ post.title }}</div>
        <div class="card-body p-2">
          <pre class="bg-light p-3 rounded overflow-auto" style="max-height: 300px">
{{ post.code }}
          </pre>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import avatarImg from './1.png'

const user = ref({
  avatar: avatarImg,
  username: 'lindi530',
  following: 15,
  followers: 11,
  views: '1.4万'
})

const posts = ref([
  {
    title: 'AcWing 6122. 农夫约翰的奶酪块',
    code: `#include <bits/stdc++.h>
using namespace std;
const int N = 1e3 + 10;
int n, q;
int a[N][N], b[N][N], c[N][N];
int main() {
    cin >> n >> q;
    int res = 0;
    for (int i = 1; i <= q; i++) {
        // 省略实现
    }
}`
  },
  {
    title: 'AcWing 6001. 欣柴',
    code: `#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N = 1e5 + 10;
int main() {
    // 示例代码
    return 0;
}`
  }
])
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
}
</style>
