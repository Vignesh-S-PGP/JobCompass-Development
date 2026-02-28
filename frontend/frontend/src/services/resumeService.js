import api from "./api"

// ⬆️ UPLOAD RESUME WITH TITLE
export const uploadResume = (file, title) => {
  const formData = new FormData()

  formData.append("resume", file)       // backend expects "resume"
  formData.append("title", title || "") // safe default

  return api.post("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

// ⬇️ FETCH USER RESUMES
export const getResumes = () => {
  return api.get("/resumes")
}
