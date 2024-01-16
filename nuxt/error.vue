<script setup lang="ts">
const error: any = useError()
</script>

<template>
  <Head>
    <Title>{{ $t('error') }} - {{ $t('adminPanel') }}</Title>
    <Meta :content="$t('error')" name="description" />
  </Head>
  <v-card>
    <v-layout class="content flex-column align-center justify-center mx-auto v-col-xl-6 v-col-lg-8 v-col-md-10 v-col-12">
      <v-card-title tag="h1" class="text-center pb-6">
        {{ $t('error') }} {{ error.statusCode }}
      </v-card-title>
      <v-main class="flex-grow-0">
        {{ error?.message }}
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped lang="scss">
.content {
  min-height: 100vh;
  h1 {
    font-size: 50px;
  }
  main {
    font-size: 20px;
  }
}
</style>
