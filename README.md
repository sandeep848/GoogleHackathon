# SpeechText: Google Cloud Speech Application

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933.svg)](https://nodejs.org/)
[![Google Cloud](https://img.shields.io/badge/Platform-Google%20Cloud-4285F4.svg)](https://cloud.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A browser-based speech transcription application built for Google Cloud. Users can record audio, transcribe it with Speech-to-Text, store transcript metadata in Firestore and optionally retain audio in Cloud Storage.

## Architecture

~~~mermaid
flowchart LR
    A["Browser recorder"] --> B["Express server"]
    B --> C["Speech-to-Text"]
    C --> D["Transcript"]
    D --> E["Firestore"]
    B --> F["Cloud Storage"]
~~~

## Stack

- Node.js and Express
- Google Cloud Speech-to-Text
- Firestore
- Cloud Storage
- App Engine Standard

## Local setup

~~~bash
git clone -b speechtext https://github.com/sandeep848/GoogleHackathon.git
cd GoogleHackathon
npm install
gcloud auth application-default login
export GOOGLE_CLOUD_PROJECT="your-project-id"
npm start
~~~

The repository's default branch is currently `speechtext`.

## Google Cloud configuration

Enable:

- `speech.googleapis.com`
- `firestore.googleapis.com`
- `storage.googleapis.com`
- `appengine.googleapis.com`

Create Firestore in Native mode. Grant the App Engine service account only the permissions required for Speech-to-Text, Firestore and the selected storage bucket.

### Optional environment variables

| Variable | Purpose | Default |
|---|---|---|
| `TRANSCRIPTS_BUCKET` | Bucket used for retained audio | Project App Engine bucket |
| `TRANSCRIPTS_COLLECTION` | Firestore collection | `transcriptions` |
| `TRANSCRIPTS_LANGUAGE` | Recognition language | `en-US` |
| `TRANSCRIPTS_MODEL` | Speech recognition model | `short` |

## Deployment

~~~bash
gcloud app deploy
gcloud app browse
~~~

## Data flow and failure behavior

Audio is recorded as WebM/Opus when supported. Successful transcriptions are written to Firestore. Storage is optional: if an audio upload fails, transcript persistence can still succeed.

## Security and privacy

- Do not commit service-account keys.
- Use Application Default Credentials locally and workload identity in hosted environments.
- Inform users before recording or retaining audio.
- Configure a retention period for stored audio and transcripts.
- Apply least-privilege IAM permissions and restrict bucket access.

## Limitations

- Browser recording support depends on available media codecs.
- Recognition accuracy varies with language, microphone quality, background noise and speaker characteristics.
- The current project does not include automated tests or infrastructure provisioning.
- Recorded speech may be sensitive personal data and must be handled according to applicable consent and privacy requirements.

## License

Distributed under the [MIT License](LICENSE).
