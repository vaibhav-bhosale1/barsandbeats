# 🎵 BarsAndBeats

**BarsAndBeats** is a real-time collaborative music jamming platform that allows users to create and join a shared streaming session with friends. Participants can queue YouTube videos, upvote their favorite tracks, and enjoy an automatically managed playback experience where the most upvoted video plays next.


<img width="1890" height="838" alt="image" src="https://github.com/user-attachments/assets/e8b9edcc-8ffb-40a4-8253-1370a69ec467" />


## 🚀 Features

- 🔗 Create or join live streaming rooms using a unique session ID
- 🎥 Add YouTube videos to a shared queue
- 👍 Vote on your favorite videos
- 🥇 Auto-play the most upvoted video in the queue
- 🕒 Seamless queue management and real-time sync
- 👥 Designed for remote music sessions with friends

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Zustand, React Hook Form
- **Backend:** Node.js (Express), Pusher Channels (WebSockets for real-time sync)
- **Deployment:** Docker, GitHub Actions, AWS EC2 (CI/CD)
- **APIs:** YouTube Data API v3

## 📦 Installation

### Prerequisites

- Node.js (v18+ recommended)
- Docker (optional for containerized deployment)
- A YouTube Data API key
- A Pusher Channels account

### Local Setup

1. **Clone the repo**

```bash
git clone https://github.com/vaibhav-bhosale1/barsandbeats.git
cd barsandbeats
