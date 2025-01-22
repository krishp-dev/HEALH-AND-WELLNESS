// // PeerJS setup
// const peer = new Peer();
// const peerIdInput = document.getElementById('peerId');
// const connectIdInput = document.getElementById('connectId');
// const connectBtn = document.getElementById('connectBtn');
// const localVideo = document.getElementById('localVideo');
// const remoteVideo = document.getElementById('remoteVideo');


// peer.on('open', (id) => {
//     peerIdInput.value = id;
// });


// navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//     .then((stream) => {
       
//         localVideo.srcObject = stream;

     
//         peer.on('call', (call) => {
//             call.answer(stream); 
//             call.on('stream', (remoteStream) => {
//                 remoteVideo.srcObject = remoteStream; 
//             });
//         });

//         connectBtn.addEventListener('click', () => {
//             const connectId = connectIdInput.value;
//             if (connectId) {
//                 const call = peer.call(connectId, stream); 
//                 call.on('stream', (remoteStream) => {
//                     remoteVideo.srcObject = remoteStream; 
//                 });
//             }
//         });
//     })
//     .catch((err) => console.error('Failed to get local stream:', err));


// vc.js
class VideoCall {
    constructor() {
        this.localStream = null;
        this.isAudioEnabled = true;
        this.isVideoEnabled = true;
        this.connectionStatus = 'disconnected';
        
        this.initializeMedia();
        this.bindEvents();
    }

    async initializeMedia() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            const localVideo = document.getElementById('localVideo');
            localVideo.srcObject = this.localStream;
            this.updateConnectionStatus('connected');
        } catch (error) {
            this.showError('Failed to access camera and microphone. Please check your permissions.');
            console.error('Error accessing media devices:', error);
        }
    }

    bindEvents() {
        document.getElementById('toggleAudio').addEventListener('click', () => this.toggleAudio());
        document.getElementById('toggleVideo').addEventListener('click', () => this.toggleVideo());
        document.getElementById('endCall').addEventListener('click', () => this.endCall());
    }

    toggleAudio() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            this.isAudioEnabled = audioTrack.enabled;
            
            const audioBtn = document.getElementById('toggleAudio');
            audioBtn.innerHTML = `<i class="fas fa-microphone${this.isAudioEnabled ? '' : '-slash'}"></i>`;
            audioBtn.style.background = this.isAudioEnabled ? '#2c7be5' : '#dc3545';
        }
    }

    toggleVideo() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            this.isVideoEnabled = videoTrack.enabled;
            
            const videoBtn = document.getElementById('toggleVideo');
            videoBtn.innerHTML = `<i class="fas fa-video${this.isVideoEnabled ? '' : '-slash'}"></i>`;
            videoBtn.style.background = this.isVideoEnabled ? '#2c7be5' : '#dc3545';
        }
    }

    endCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
            this.updateConnectionStatus('disconnected');
            
            const localVideo = document.getElementById('localVideo');
            localVideo.srcObject = null;
        }
    }

    updateConnectionStatus(status) {
        this.connectionStatus = status;
        const statusElement = document.getElementById('connectionStatus');
        statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusElement.style.color = status === 'connected' ? '#00d97e' : '#dc3545';
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

// Initialize video call when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VideoCall();
});

        