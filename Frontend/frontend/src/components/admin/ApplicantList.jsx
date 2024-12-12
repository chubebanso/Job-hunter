import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavbarAdmin from '../shared/NavbarAdmin';

const ApplicantsList = () => {
  const { id } = useParams(); // Company ID from URL
  const [applicants, setApplicants] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [skills, setSkills] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicantsAndProfiles = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        // Fetch applicants for the company's jobs
        const applicantsResponse = await axios.get(`http://localhost:8080/api/v1/${id}/profiles`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const applicantUsers = applicantsResponse.data.data;

        const profilesMap = {};
        const skillsMap = {};

        // Fetch profiles and skills for each user
        await Promise.all(
          applicantUsers.map(async (applicant) => {
            const profileResponse = await axios.get(
              `http://localhost:8080/api/v1/profiles/userID/${applicant.userId}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const profileData = profileResponse.data.data;
            profilesMap[applicant.userId] = profileData;

            // Fetch skills for the profile
            const skillsResponse = await axios.get(
              `http://localhost:8080/api/v1/profiles/${profileData.id}/skills/get`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            skillsMap[applicant.userId] = skillsResponse.data.data.map((skill) => skill.name).join(', ');
          })
        );

        setApplicants(applicantUsers);
        setProfiles(profilesMap);
        setSkills(skillsMap);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applicants, profiles, or skills:', err);
        setError('Failed to fetch applicants, profiles, or skills.');
        setLoading(false);
      }
    };

    fetchApplicantsAndProfiles();
  }, [id]);

  const handleStatusChange = (userId, status) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [userId]: status,
    }));
  };

  const confirmStatusChange = async (jobId, userId) => {
    const status = selectedStatus[userId];
    if (!status) {
      alert('Please select a status before confirming.');
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(
        `http://localhost:8080/api/v1/jobs/${jobId}/status`,
        {},
        {
          params: { userId, status },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert(`Status updated to ${status} for user ${userId}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <NavbarAdmin />
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <h1 className="font-bold text-lg mb-5">Applicants for Company ID: {id}</h1>
        {applicants.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Gender</th>
                <th className="text-left p-2">Age</th>
                <th className="text-left p-2">Bio</th>
                <th className="text-left p-2">Phone</th>
                <th className="text-left p-2">Date of Birth</th>
                <th className="text-left p-2">Skills</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Confirm</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => {
                const profile = profiles[applicant.userId] || {};
                const skillList = skills[applicant.userId] || 'N/A';
                return (
                  <tr key={applicant.userId} className="border-b">
                    <td className="p-2">{applicant.name}</td>
                    <td className="p-2">{applicant.email}</td>
                    <td className="p-2">{applicant.gender}</td>
                    <td className="p-2">{applicant.age}</td>
                    <td className="p-2">{profile.bio || 'N/A'}</td>
                    <td className="p-2">{profile.phoneNumber || 'N/A'}</td>
                    <td className="p-2">{profile.dateOfBirth || 'N/A'}</td>
                    <td className="p-2">{skillList}</td>
                    <td className="p-2">
                      <select
                        onChange={(e) => handleStatusChange(applicant.userId, e.target.value)}
                        value={selectedStatus[applicant.userId] || ''}
                        className="border rounded px-2 py-1"
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        <option value="accepted">Accept</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => confirmStatusChange(applicant.jobId, applicant.userId)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Confirm
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No applicants found for this company.</p>
        )}
      </div>
    </div>
  );
};

export default ApplicantsList;
