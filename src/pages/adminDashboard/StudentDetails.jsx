import React from "react";

const StudentDetails = ({ user, category }) => {
  if (!user || !category) return null;

  const renderCategoryDetails = () => {
    switch (category) {
      case "reports":
        return user.reports?.length > 0 ? (
          <div className="space-y-6">
            {user.reports.map((report, index) => (
              <div
                key={index}
                className="border border-gray-300 p-6 rounded-lg bg-blue-50"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {report.title}
                  </h3>
                  <div className="flex flex-col items-end space-y-1">
                    {report.date_of_report && (
                      <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                        Report Date:{" "}
                        {new Date(report.date_of_report).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    )}
                    {report.createdAt && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        Created:{" "}
                        {new Date(report.createdAt).toLocaleDateString("en-US")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Certificate Section */}
                  {report.certificateId && (
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-green-700 mb-2">
                        📜 Certificate
                      </h4>
                      <p className="font-medium">
                        {report.certificateId.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {report.certificateId.description}
                      </p>
                      {report.certificateId.certificate_link && (
                        <a
                          href={report.certificateId.certificate_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                  )}

                  {/* Course Section */}
                  {report.courseId && (
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-purple-700 mb-2">
                        📚 Course
                      </h4>
                      <p className="font-medium">{report.courseId.title}</p>
                      <p className="text-sm text-gray-600">
                        {report.courseId.description}
                      </p>
                      {report.courseId.course_image && (
                        <img
                          src={report.courseId.course_image}
                          alt="Course"
                          className="mt-2 w-20 h-20 object-cover rounded"
                        />
                      )}
                    </div>
                  )}

                  {/* Achievement Section */}
                  {report.userAchievementId && (
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-yellow-700 mb-2">
                        🏆 Achievement
                      </h4>
                      <p className="font-medium">
                        {report.userAchievementId.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {report.userAchievementId.description}
                      </p>
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-1">
                        {report.userAchievementId.category}
                      </span>
                      {report.userAchievementId.achievement_image && (
                        <img
                          src={report.userAchievementId.achievement_image}
                          alt="Achievement"
                          className="mt-2 w-20 h-20 object-cover rounded"
                        />
                      )}
                    </div>
                  )}

                  {/* Event Section */}
                  {report.eventId && (
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-red-700 mb-2">
                        🎉 Event
                      </h4>
                      <p className="font-medium">{report.eventId.title}</p>
                      <p className="text-sm text-gray-600">
                        {report.eventId.description}
                      </p>
                      {report.eventId.photo && (
                        <img
                          src={report.eventId.photo}
                          alt="Event"
                          className="mt-2 w-20 h-20 object-cover rounded"
                        />
                      )}
                    </div>
                  )}

                  {/* Note Section */}
                  {report.noteId && (
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-indigo-700 mb-2">
                        📝 Note
                      </h4>
                      <p className="font-medium">{report.noteId.title}</p>
                      <p className="text-sm text-gray-600">
                        {report.noteId.content}
                      </p>
                      {report.noteId.createdAt && (
                        <span className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(report.noteId.createdAt).toLocaleDateString(
                            "en-US"
                          )}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Difficulty Section */}
                  {report.difficultyId && (
                    <div className="bg-white p-4 rounded border border-orange-200">
                      <h4 className="font-semibold text-orange-700 mb-2">
                        ⚠️ Difficulty
                      </h4>
                      <p className="font-medium">{report.difficultyId.title}</p>
                      <p className="text-sm text-gray-600">
                        {report.difficultyId.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No reports available</p>
        );
      case "tickets":
        return user.tickets?.length > 0 ? (
          <ul>
            {user.tickets.map(
              (ticket, index) => (
                console.log(ticket), (<li key={index}>{ticket.title}</li>)
              )
            )}
          </ul>
        ) : (
          <p>No tickets available</p>
        );
      case "certificates":
        return user.certificates?.length > 0 ? (
          <div className="space-y-4">
            {user.certificates.map((certificate, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded-lg bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {certificate.title}
                </h3>

                {certificate.description && (
                  <p className="text-gray-600 mb-3">
                    <span className="font-medium">Description: </span>
                    {certificate.description}
                  </p>
                )}

                {certificate.certificate_link && (
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">
                      Certificate Link:{" "}
                    </span>
                    <a
                      href={certificate.certificate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {certificate.certificate_link}
                    </a>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  <span className="font-medium">Certificate Image: </span>
                  {certificate.certificate_image ? (
                    <img
                      src={certificate.certificate_image}
                      alt={`${certificate.title} certificate`}
                      className="mt-2 max-w-xs rounded border"
                    />
                  ) : (
                    <span className="italic">No image available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No certificates available</p>
        );
      case "financialReports":
        return user.financialReports?.length > 0 ? (
          <div className="space-y-4">
            {user.financialReports.map((report, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded-lg bg-green-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {report.title}
                  </h3>
                  {report.date_of_report && (
                    <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                      {new Date(report.date_of_report).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  )}
                </div>

                {report.description && (
                  <p className="text-gray-600 mb-3">
                    <span className="font-medium">Description: </span>
                    {report.description}
                  </p>
                )}

                <div className="text-sm text-gray-500">
                  <span className="font-medium">Report Document: </span>
                  {report.financial_report_image ? (
                    <div className="mt-2">
                      <img
                        src={report.financial_report_image}
                        alt={`${report.title} financial report`}
                        className="max-w-xs rounded border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() =>
                          window.open(report.financial_report_image, "_blank")
                        }
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Click to view full size
                      </p>
                    </div>
                  ) : (
                    <span className="italic">No document available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No financial reports available</p>
        );
      case "userAchievements":
        return user.achievements?.length > 0 ? (
          <div className="space-y-4">
            {user.achievements.map((achievement, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded-lg bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {achievement.title}
                </h3>

                {achievement.description && (
                  <p className="text-gray-600 mb-3">
                    <span className="font-medium">Description: </span>
                    {achievement.description}
                  </p>
                )}

                {achievement.category && (
                  <div className="inline-block">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {achievement.category}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No achievements available</p>
        );
      case "courses":
        return user.courses?.length > 0 ? (
          <div className="space-y-4">
            {user.courses.map((course, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded-lg bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {course.title}
                </h3>

                {course.description && (
                  <p className="text-gray-600 mb-3">
                    <span className="font-medium">Description: </span>
                    {course.description}
                  </p>
                )}

                <div className="text-sm text-gray-500">
                  <span className="font-medium">Course Image: </span>
                  {course.course_image ? (
                    <img
                      src={course.course_image}
                      alt={`${course.title} course`}
                      className="mt-2 max-w-xs rounded border"
                    />
                  ) : (
                    <span className="italic">No image available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No courses available</p>
        );
      default:
        return <p>No details available</p>;
    }
  };
  const getCategoryTitle = () => {
    switch (category) {
      case "reports":
        return "Reports";
      case "tickets":
        return "Tickets";
      case "certificates":
        return "Certificates";
      case "financialReports":
        return "Financial Reports";
      case "userAchievements":
        return "Achievements";
      case "courses":
        return "Courses";
      default:
        return "Details";
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        {getCategoryTitle()} for {user.name}
      </h2>
      {renderCategoryDetails()}
    </div>
  );
};

export default StudentDetails;
