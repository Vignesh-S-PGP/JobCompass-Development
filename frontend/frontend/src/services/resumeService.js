import api from "./api"

export const uploadResume = (file) => {
  const formData = new FormData()
  formData.append("resume", file)

  return api.post("/resumes/upload", formData)
}

export const getResumes = () => {
  return api.get("/resumes")
}
