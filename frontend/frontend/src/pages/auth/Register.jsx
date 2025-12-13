export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          JobCompass Register
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <select className="w-full mb-4 px-4 py-2 border rounded">
          <option value="">Select Role</option>
          <option value="job_seeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <button className="w-full bg-black text-white py-2 rounded">
          Register
        </button>
      </div>
    </div>
  )
}
