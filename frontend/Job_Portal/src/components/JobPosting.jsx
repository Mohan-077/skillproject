import React ,{ Component } from 'react';
import { BASEURL, callApi } from '../api.js';

import '../css/JobPosting.css';

export default class JobPosting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      isLoading: false,
      message: '',
      jobs: [],
      id: null,
      title: '',
      company: '',
      location: '',
      jobtype: '',
      salary: '',
      description: '',
      formData: {
        jobTitle: '',
        companyName: '',
        location: '',
        jobType: '1',
        salary: '',
        jobDescription: ''
      }
    };

    // Bind methods
    this.updateData = this.updateData.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.saveResponse = this.saveResponse.bind(this);
  }

  componentDidMount() {
    this.fetchJobs();
  }

  fetchJobs = () => {
    this.setState({ isLoading: true });
    callApi(
      "GET",
      BASEURL + "jobs/read",
      "",
      (response) => {
        if (response.includes("400::")) {
          const [, message] = response.split("::");
          this.setState({
            message: message || 'Error fetching jobs',
            isLoading: false
          });
        } else {
          try {
            const jobsData = JSON.parse(response);
            this.setState({
              jobs: jobsData,
              isLoading: false
            });
          } catch (error) {
            this.setState({
              message: 'Error parsing job data',
              isLoading: false
            });
          }
        }
      }
    );
  }

  togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup,
      id: null,
      title: '',
      company: '',
      location: '',
      jobtype: '',
      salary: '',
      description: '',
      formData: {
        jobTitle: '',
        companyName: '',
        location: '',
        jobType: '1',
        salary: '',
        jobDescription: ''
      }
    });
  };

  showPopup() {
    this.setState({ showPopup: true });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });

    const jobData = {
      title: this.state.formData.jobTitle,
      company: this.state.formData.companyName,
      location: this.state.formData.location,
      jobtype: this.state.formData.jobType,
      salary: this.state.formData.salary,
      description: this.state.formData.jobDescription
    };

    // If id exists, it's an update operation
    if (this.state.id) {
      jobData.id = this.state.id;
      callApi(
        "PUT",
        BASEURL + "jobs/update",
        JSON.stringify(jobData),
        this.saveResponse
      );
    } else {
      // Otherwise it's a create operation
      callApi(
        "POST",
        BASEURL + "jobs/create",
        JSON.stringify(jobData),
        this.saveResponse
      );
    }
  };
  saveResponse = (response) => {
    const [status, message] = response.split("::");
    if (status === "200") {
      this.setState({
        message: message || 'Operation completed successfully!',
        isLoading: false,
        showPopup: false,
        id: null,
        formData: {
          jobTitle: '',
          companyName: '',
          location: '',
          jobType: '1',  // 1 = Full-Time
          salary: '',
          jobDescription: ''
        }
      }, () => {
        // Refresh the job list after successful operation
        this.fetchJobs();
      });
    } else {
      this.setState({
        message: message || 'Error processing request',
        isLoading: false
      });
    }
  };
  updateData(id)
  {
    callApi("GET", BASEURL + "jobs/getdata/" + id, "", this.updateResponse);
  }
  updateResponse(response)
  {
    if(response.includes("404::"))
    {
      alert(response.split("::")[1]);
      return;
    }
    let data = JSON.parse(response);
    this.setState({
      id:data.id,
      title:data.title,
      company:data.company,
      location:data.location,
      jobtype:data.jobtype,
      salary:data.salary,
      description:data.description,
      formData: {
        jobTitle: data.title,
        companyName: data.company,
        location: data.location,
        jobType: data.jobtype,
        salary: data.salary,
        jobDescription: data.description
      }
    });
    this.showPopup();
  }
  deleteData(id)
  {
    let resp = confirm("Click OK to confirm the deletion");
    if(resp === false)
        return ;
    callApi("DELETE", BASEURL + "jobs/delete/" + id, "", this.saveResponse);
  }

  render() {
    const { showPopup, isLoading, message, formData, jobs } = this.state;

    return (
      <div className="job-posting-container">
        <div className="job-posting-header">
          <h2>Job Postings</h2>
          <button onClick={this.togglePopup} className="add-job-button">
            + Post New Job
          </button>
        </div>

        {message && <div className="success-message">{message}</div>}

        <div className="job-listings">
          {isLoading && <div className="loading">Loading jobs...</div>}

          {!isLoading && jobs.length === 0 && (
            <div className="no-jobs">No job postings available. Be the first to post a job!</div>
          )}

          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h3 className="job-title">{job.title}</h3>
                <span className="job-salary">{job.salary}</span>
              </div>
              <div className="job-card-company">
                <span className="company-name">{job.company}</span>
                <span className="job-location">{job.location}</span>
              </div>
              <div className="job-type">
                {job.jobtype === "1" ? "Full-Time" :
                 job.jobtype === "2" ? "Part-Time" :
                 job.jobtype === "3" ? "Contract" :
                 job.jobtype === "4" ? "Internship" :
                 job.jobtype === "5" ? "Remote" : job.jobtype}
              </div>
              <div className="job-description">
                <p>{job.description}</p>
              </div>
              <div className="job-actions">
                <button onClick={() => this.updateData(job.id)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => this.deleteData(job.id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-header">
                <h3>{this.state.id ? 'Update Job Posting' : 'Post a New Job'}</h3>
                <span className="close-button" onClick={this.togglePopup}>&times;</span>
              </div>
              <form onSubmit={this.handleSubmit} className="job-form">
                <div className="form-group">
                  <label htmlFor="jobTitle">Job Title*</label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={this.handleChange}
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="companyName">Company Name*</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={this.handleChange}
                    placeholder="e.g. Tech Solutions Inc."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location*</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={this.handleChange}
                    placeholder="e.g. Hyderabad, India"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="jobType">Job Type*</label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="0"></option>
                    <option value="1">Full-Time</option>
                    <option value="2">Part-Time</option>
                    <option value="3">Contract</option>
                    <option value="4">Internship</option>
                    <option value="5">Remote</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="salary">Salary Range*</label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={this.handleChange}
                    placeholder="e.g. ₹15-20 LPA"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="jobDescription">Job Description & Requirements*</label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={this.handleChange}
                    placeholder="Describe the role, responsibilities, and required qualifications..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={this.togglePopup} className="cancel-button">
                    Cancel
                  </button>
                  <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? 'Processing...' : (this.state.id ? 'Update Job' : 'Post Job')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    );
  }
}