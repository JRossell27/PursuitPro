"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ApplicationStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  salary?: string;
  jobUrl?: string;
  description?: string;
  location?: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newApplication, setNewApplication] = useState({
    company: "",
    position: "",
    status: "APPLIED" as ApplicationStatus,
    appliedDate: "",
    salary: "",
    jobUrl: "",
    description: "",
    location: ""
  });

  const [isScrapingUrl, setIsScrapingUrl] = useState(false);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch applications when user is authenticated
  useEffect(() => {
    if (session?.user) {
      fetchApplications();
    }
  }, [session]);

  const fetchApplications = async () => {
    try {
      // const response = await fetch('/api/applications');
      // if (response.ok) {
        // const data = await response.json();
        // setApplications(data);
      // }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPLIED": return "bg-blue-100 text-blue-800";
      case "INTERVIEW": return "bg-yellow-100 text-yellow-800";
      case "OFFER": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "APPLIED": return "Applied";
      case "INTERVIEW": return "Interview";
      case "OFFER": return "Offer";
      case "REJECTED": return "Rejected";
      default: return status;
    }
  };

  const scrapeJobData = async (url: string) => {
    setIsScrapingUrl(true);
    try {
      // const response = await fetch('/api/applications');
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        // },
        body: JSON.stringify({ url }),
      // });

      // if (response.ok) {
        const jobData = await response.json();
        setNewApplication(prev => ({
          ...prev,
          company: jobData.company || prev.company,
          position: jobData.position || prev.position,
          description: jobData.description || prev.description,
          location: jobData.location || prev.location,
          salary: jobData.salary || prev.salary,
        // }));
      // } else {
        alert('Failed to scrape job data. Please fill in manually.');
      // }
    } catch (error) {
      console.error('Error scraping job data:', error);
      alert('Failed to scrape job data. Please fill in manually.');
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const handleUrlBlur = () => {
    if (newApplication.jobUrl && !newApplication.company) {
      scrapeJobData(newApplication.jobUrl);
    }
  };

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newApplication.company && newApplication.position) {
      try {
        // const response = await fetch('/api/applications');
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          // },
          body: JSON.stringify(newApplication),
        // });

        // if (response.ok) {
          const newApp = await response.json();
          setApplications([newApp, ...applications]);
          setNewApplication({
            company: "",
            position: "",
            status: "APPLIED",
            appliedDate: "",
            salary: "",
            jobUrl: "",
            description: "",
            location: ""
          // });
          setShowAddForm(false);
        // } else {
          alert('Failed to add application. Please try again.');
        // }
      // } catch (error) {
        console.error('Error adding application:', error);
        alert('Failed to add application. Please try again.');
      // }
    }
  };

  const stats = {
    total: applications.length,
    interviews: applications.filter(app => app.status === "INTERVIEW").length,
    offers: applications.filter(app => app.status === "OFFER").length,
    applied: applications.filter(app => app.status === "APPLIED").length
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to sign in
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                PursuitPro
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome back, {session.user?.name}!</span>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Application
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Interviews</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.interviews}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Offers</h3>
            <p className="text-2xl font-bold text-green-600">{stats.offers}</p>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Job Applications</h2>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first job application.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  + Add Your First Application
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {app.jobUrl ? (
                          <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            {app.company}
                          </a>
                        ) : (
                          app.company
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                          {getStatusDisplay(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.location || "Not specified"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.salary || "Not specified"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Application Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Application</h3>
            <form onSubmit={handleAddApplication}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job URL <span className="text-xs text-gray-500">(paste and we'll auto-fill the details)</span>
                  </label>
                  <input
                    type="url"
                    value={newApplication.jobUrl}
                    onChange={(e) => setNewApplication({...newApplication, jobUrl: e.target.value})}
                    onBlur={handleUrlBlur}
                    placeholder="https://www.linkedin.com/jobs/view/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isScrapingUrl && (
                    <p className="text-xs text-blue-600 mt-1">🔄 Scraping job details...</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={newApplication.company}
                      onChange={(e) => setNewApplication({...newApplication, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position *
                    </label>
                    <input
                      type="text"
                      value={newApplication.position}
                      onChange={(e) => setNewApplication({...newApplication, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newApplication.status}
                      onChange={(e) => setNewApplication({...newApplication, status: e.target.value as ApplicationStatus})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="OFFER">Offer</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Applied Date
                    </label>
                    <input
                      type="date"
                      value={newApplication.appliedDate}
                      onChange={(e) => setNewApplication({...newApplication, appliedDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newApplication.location}
                      onChange={(e) => setNewApplication({...newApplication, location: e.target.value})}
                      placeholder="e.g., New York, NY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="text"
                    value={newApplication.salary}
                    onChange={(e) => setNewApplication({...newApplication, salary: e.target.value})}
                    placeholder="e.g., $120,000 or $80k-$120k"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description Summary
                  </label>
                  <textarea
                    value={newApplication.description}
                    onChange={(e) => setNewApplication({...newApplication, description: e.target.value})}
                    rows={4}
                    placeholder="Key responsibilities, requirements, or notes about this role..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 