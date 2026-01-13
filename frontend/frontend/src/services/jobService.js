import api from "./api"

const createJob = (data) =>
  api.post("/jobs", data)

const getMyJobs = () =>
  api.get("/jobs/my")

export default {
  createJob,
  getMyJobs
}
