export default function JobCompassLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="compass-loader">
        <div className="face">
          <span className="mark n">J</span>
          <span className="mark e">E</span>
          <span className="mark s">S</span>
          <span className="mark w">W</span>

          <div className="needle"></div>
          <div className="pivot"></div>
        </div>
      </div>

      <p className="mt-6 font-semibold text-lg text-black">
        JobCompass is analyzing your resume…
      </p>
    </div>
  )
}
