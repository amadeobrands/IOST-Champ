<template>
  <!--------------------- LEVEL 2 ----------------------------------->
  <div
    v-if="selectedLevel === 2"
    class="row"
  >

    <q-card flat class="my-card">
      <q-card-section>
        <div class="text-h6">IOST blockchain account</div>
        <div class="text-subtitle2">Enable your existing account in iWallet, or create a new account.</div>
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>
                1. If you have an existing account and it's loaded in iWallet (make sure iWallet is UNLOCKED): Check solution immediately.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-btn @click="checkWallet">Check iWallet</q-btn>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>
                2. If you don't have an IOST account, you can create one with Blockdevs.
              </q-item-label>
              <q-input
                square outlined
                label="IOST Account Name"
                :disable="level > 2"
                v-model="proposedAccountName"
              />
              <q-btn
                @click="checkAvailability"
              >
                Check name availability
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div>
                <level-submit-button
                  :inputAttempts="inputAttempts"
                  :level="level"
                  :submissionProgress="submissionProgress"
                  :buttonLevel="2"
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
        Explain Accounts
      </q-card-section>
    </q-card>

  </div>
</template>

<script>
import { SDK } from 'boot/iost'
import { mapActions } from 'vuex'

export default {
  components: {
    LevelSubmitButton: () => import('components/LevelSubmitButton.vue')
  },
  props: {
    address: {
      type: String
    },
    selectedLevel: {
      type: Number
    },
    level: {
      type: Number
    },
    solution: {
      type: String
    },
    submissionProgress: {
      type: Number
    },
    inputAttempts: {
      type: Number
    }
  },
  data () {
    return {
      proposedAccountName: ''
    }
  },
  methods: {

    ...mapActions('external', [
      'iostGetAccount'
    ]),

    checkWallet () {
      console.log(SDK)
    },
    checkAvailability () {
      this.iostGetAccount(this.proposedAccountName)
    }
  }
}
</script>

<style>
</style>
