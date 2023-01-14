<script>

export default {
  components: {
  
  },
  data: () => ({
      camera_stream: null,
      media_recorder: null,
      blobs_recorded: [],
      download_link: '',
      video: '',
      MediaStreamHelper: '', 
      video_local: '',
      record_in_progess: false,
      blob_video: '',
  }),
  mounted(){
      this.video = document.querySelector("#video");
      this.start_camera()
  },
  methods:{
    async start_camera(){
        let me = this
        me.camera_stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        me.video.srcObject = me.camera_stream;
    },
    start_record(){
        let me = this
        me.video_local = ''
        me.blob_video = ''
        me.media_recorder = new MediaRecorder(me.camera_stream, { mimeType: 'video/webm' });
        me.media_recorder.addEventListener('dataavailable', function(e) {
            me.blobs_recorded.push(e.data);
        });
        me.media_recorder.start(1000);

        setInterval(function() { me.timer_video++ }, 1000);
    },
    stop_record(){
      let me = this
      me.video_local = URL.createObjectURL(new Blob(me.blobs_recorded, { type: 'video/webm' }));
      me.blob_video = new Blob(me.blobs_recorded, { type: 'video/webm' })
      me.record_in_progess = false
    },
    upload_video(){
        let me = this
        const formData = new FormData();
        formData.append('video', me.blob_video);

        me.axios.post( `http://127.0.0.1:8000/api/upload_video`, formData )
        .then(res => {
            me.$swal.fire('upload successfull', '', 'success')
        })
        .catch(function (error) { console.log(error) })
    },


  }
}
</script>

<template>
  <div style="width: 100% !important; border: 1px solid gray; border-radius: 20px;">
    
    <button v-if="record_in_progess==false" @click="start_record(); record_in_progess=true;" class="btn_record"> <div class="btn_red"></div> </button>
    <button v-else @click="stop_record();" class="btn_record"> <div class="btn_green"></div> </button>

    <a :href="video_local" v-if="video_local" target="_blank" class="btn_download">Descargar video</a>
    <a href="#" v-if="blob_video" @click="upload_video()" class="btn_upload">Subir video</a>
    
    <video id="video" autoplay style="border-radius: 20px;"></video>

  </div>
</template>


<style>
  .btn_record{
    position: absolute;
    bottom: 20px;
    left: 44%;
    z-index: 4;
    height: 70px;
    width: 70px;
    border-radius: 100%;
    cursor: pointer;
    background-color: white;
  }

  .btn_red{
    height: 30px;
    width: 30px;
    border-radius: 100%;
    background-color: red;
    margin: auto;
  }
  .btn_green{
    height: 30px;
    width: 30px;
    border-radius: 100%;
    background-color: green;
    margin: auto;
  }

  .btn_download{
    position: absolute;
    bottom: 20px;
    right: 10px;
    z-index: 4;
    padding: 5px;
    border-radius: 7px;
    min-width: 120px;
    text-align: center;
    cursor: pointer;
    background-color: rgb(37, 185, 165);
    color: white;
  }

  .btn_upload{
    position: absolute;
    top: 20px;
    right: 10px;
    z-index: 4;
    padding: 5px;
    border-radius: 7px;
    min-width: 120px;
    text-align: center;
    cursor: pointer;
    background-color: rgb(37, 185, 165);
    color: white;
  }
</style>