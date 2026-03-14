export default function Review({ isDark, setStep, photo }) {

  return (
    <div className="space-y-6">

      <div className={`rounded-xl border p-8 ${
        isDark
          ? "bg-[#140804] border-neutral-700"
          : "bg-white border-neutral-300"
      }`}>

        <h2 className="text-xl font-semibold mb-6">
          Review Your Order
        </h2>

        <div className="bg-[#1a0d05] rounded-xl p-5 space-y-2">

          <div className="flex justify-between">
            <span>Name</span>
            <span>dt</span>
          </div>

          <div className="flex justify-between">
            <span>Email</span>
            <span>skn@gmail.com</span>
          </div>

        </div>

        <div className="bg-[#1a0d05] rounded-xl p-5 mt-4">

          <p className="mb-3">Uploaded Photo</p>

          <img
            src={photo}
            alt="uploaded"
            className="w-24 rounded"
          />

        </div>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <button
          onClick={() => setStep(2)}
          className="py-4 border rounded-xl"
        >
          ← Back
        </button>

        <button className="py-4 bg-[#d6b190] rounded-xl text-black">
          Submit for Artist Review
        </button>

      </div>

    </div>
  );
}