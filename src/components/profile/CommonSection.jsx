const CommonSection = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col items-center text-center">
        {/* <Avatar src={profile.imageUrl} className="w-24 h-24 rounded-full mb-4" /> */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {profile?.user?.name}
        </h1>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Email:</span> {profile?.user?.email}
        </p>
        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {profile?.user?.role}
        </span>
      </div>
    </div>
  );
};

export default CommonSection;
