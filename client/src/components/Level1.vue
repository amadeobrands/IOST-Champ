<template>
  <!--------------------- LEVEL 1 ----------------------------------->
  <div
    v-if="selectedLevel === 1"
    class="row"
  >
    <q-card flat class="my-card">
      <q-card-section>
        <div class="text-h6">Install and activate iWallet browser extension</div>
        <div class="text-subtitle2">Getting started with IOST.</div>
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>1. Go to <a href="https://chrome.google.com/webstore/detail/iwallet/kncchdigobghenbbaddojjnnaogfppfj?hl=en" target="_blank">iWallet extension on Chrome store</a> and install. </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div>
                <level-submit-button
                  :inputAttempts="inputAttempts"
                  :level="level"
                  :submissionProgress="submissionProgress"
                  :buttonLevel="1"
                  v-on:finish="$emit('finish')"
                />

              </div>
            </q-item-section>
          </q-item>

        </q-list>
      </q-card-section>
    </q-card>

    <q-card flat class="my-card bg-yellow-1" >
      <q-card-section>
        <div class="text-subtitle2">Notes:</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        Since there is no IOST wallet extension for other browsers yet, and we want to promote secure usage of IOST,
        IOST Champ only supports Chrome for now. Sorry Firefox users!
      </q-card-section>
    </q-card>
  </div>
</template>

<script>

export default {
  components: {
    LevelSubmitButton: () => import('components/LevelSubmitButton.vue')
  },
  props: {
    solution: {
      type: String
    },
    selectedLevel: {
      type: Number
    },
    level: {
      type: Number
    },
    submissionProgress: {
      type: Number
    },
    inputAttempts: {
      type: Number
    }
  },
  data () {
    return {}
  },
  computed: {
  },
  methods: {

  }
}
</script>

<style>
</style>
