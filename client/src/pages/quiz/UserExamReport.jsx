import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UserExamReport = () => {
  const [reportsData, setReportData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate(); // Initialize navigate

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  const getAllReportByUser = async () => {
    try {
      const res = await fetch("/api/examsReport/get-attempts-by-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });

      const responseData = await res.json();

      if (!responseData.success) {
        throw new Error(responseData.message);
      }
      return responseData;
    } catch (error) {
      console.error(error.message);
    }
  };

  const getData = async () => {
    const response = await getAllReportByUser();
    if (response && response.success) {
      setReportData(response.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={() => navigate("/play-quiz")}
      >
        Back
      </button>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Exam Name</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Total Marks</th>
              <th className="py-2 px-4 border-b">Passing Marks</th>
              <th className="py-2 px-4 border-b">Obtained Marks</th>
              <th className="py-2 px-4 border-b">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {reportsData.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">
                  {record.exam.name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {formatDate(record.createdAt)}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {record.exam.totalMarks}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {record.exam.passingMarks}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {record.result.correctAnswers.length}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {record.result.verdict}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserExamReport;
