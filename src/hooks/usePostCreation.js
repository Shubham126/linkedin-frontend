import { useState } from 'react';
import { automation } from '../api/linkedinApi';

export const usePostCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [jobStatus, setJobStatus] = useState(null);

  const createPost = async (postText, hashtags = []) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await automation.createSinglePost(postText, hashtags);
      setSuccess(true);
      setJobStatus(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateAIPost = async (topic, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await automation.generateAIPost(topic, options);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateHashtags = async (postText, count = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await automation.generateHashtags(postText, count);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPost,
    generateAIPost,
    generateHashtags,
    loading,
    error,
    success,
    jobStatus
  };
};

export default usePostCreation;
