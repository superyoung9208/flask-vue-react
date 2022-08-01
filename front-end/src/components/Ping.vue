<template>
  <div>
    <button type="button" class="btn btn-primary">{{ msg }}</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Ping',
  data () {
    return {
      msg: 'Hello, This is ping.vue component'
    }
  },
  methods: {
    getMessage () {
      const path = 'http://localhost:5000/api/ping'
      axios.get(path)
        .then(res => {
          this.msg = res.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created () {
    this.getMessage()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
