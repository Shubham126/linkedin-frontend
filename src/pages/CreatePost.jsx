import { useState } from 'react';
import { usePostCreation } from '../hooks/usePostCreation';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CreatePost() {
  const {
    createPost,
    generateAIPost,
    generateHashtags,
    loading,
    error,
    success,
    jobStatus
  } = usePostCreation();

  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const [aiLength, setAiLength] = useState('medium');
  const [includeQuestion, setIncludeQuestion] = useState(true);
  const [generatedPost, setGeneratedPost] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Generate AI Post
  const handleGenerateAIPost = async () => {
    if (!aiTopic.trim()) {
      alert('Please enter a topic');
      return;
    }

    try {
      const post = await generateAIPost(aiTopic, {
        tone: aiTone,
        length: aiLength,
        includeQuestion: includeQuestion,
        style: 'thought-leadership'
      });
      setGeneratedPost(post.text);
      setHashtags(post.hashtags || []);
    } catch (err) {
      alert('Failed to generate post: ' + err.message);
    }
  };

  // Generate Hashtags
  const handleGenerateHashtags = async () => {
    if (!generatedPost.trim()) {
      alert('Please generate a post first');
      return;
    }

    try {
      const tags = await generateHashtags(generatedPost, 5);
      setHashtags(tags);
    } catch (err) {
      alert('Failed to generate hashtags: ' + err.message);
    }
  };

  // Publish AI Post
  const handlePublishAIPost = async () => {
    if (!generatedPost.trim()) {
      alert('Please generate a post first');
      return;
    }

    try {
      await createPost(generatedPost, hashtags);
      alert('✅ Post published successfully!');
      setGeneratedPost('');
      setAiTopic('');
      setHashtags([]);
    } catch (err) {
      alert('❌ Failed to publish post: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Post Generator</h1>
        <p className="text-gray-500 mt-1">Generate and publish AI-powered LinkedIn posts</p>
      </div>

      {/* Job Status Alert */}
      {jobStatus && (
        <div className={`p-4 rounded-lg border-2 ${
          jobStatus.status === 'completed' ? 'bg-green-50 border-green-200' :
          jobStatus.status === 'failed' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {jobStatus.status === 'processing' && <LoadingSpinner size="sm" />}
              {jobStatus.status === 'completed' && <span className="text-2xl">✅</span>}
              {jobStatus.status === 'failed' && <span className="text-2xl">❌</span>}
              <div>
                <p className="font-semibold text-gray-900">
                  {jobStatus.status === 'processing' ? 'Processing...' :
                   jobStatus.status === 'completed' ? 'Completed!' :
                   jobStatus.status === 'failed' ? 'Failed' : 'Processing'}
                </p>
                <p className="text-sm text-gray-600">{jobStatus.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-red-900 font-semibold">❌ Error</p>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-green-900 font-semibold">✅ Success</p>
          <p className="text-green-700 text-sm">Post created and published successfully!</p>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">🤖 Generate Post with AI</h2>

        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic or Keyword
          </label>
          <input
            type="text"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="e.g., remote work trends, AI in business, career growth..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">Enter a topic you want the AI to generate content about</p>
        </div>

        {/* AI Options Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="inspirational">Inspirational</option>
              <option value="casual">Casual</option>
              <option value="educational">Educational</option>
              <option value="entertaining">Entertaining</option>
            </select>
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length
            </label>
            <select
              value={aiLength}
              onChange={(e) => setAiLength(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="short">Short (100-200 chars)</option>
              <option value="medium">Medium (200-500 chars)</option>
              <option value="long">Long (500+ chars)</option>
            </select>
          </div>
        </div>

        {/* Include Question */}
        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={includeQuestion}
            onChange={(e) => setIncludeQuestion(e.target.checked)}
            className="w-5 h-5 text-blue-500 rounded"
          />
          <span className="text-gray-700">Include a question to encourage engagement</span>
        </label>

        {/* Generate Button */}
        <button
          onClick={handleGenerateAIPost}
          disabled={loading || !aiTopic.trim()}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              Generating...
            </>
          ) : (
            <>
              ✨ Generate Post
            </>
          )}
        </button>

        {/* Generated Post Display */}
        {generatedPost && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-3">
            <h3 className="font-semibold text-gray-900">Generated Post</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{generatedPost}</p>

            {hashtags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Hashtags:</p>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-200 text-purple-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleGenerateHashtags}
                disabled={loading}
                className="flex-1 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                🏷️ Regenerate Hashtags
              </button>
              <button
                onClick={handlePublishAIPost}
                disabled={loading}
                className="flex-1 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                🚀 Publish Post
              </button>
            </div>

            <button
              onClick={() => {
                setGeneratedPost('');
                setAiTopic('');
                setHashtags([]);
              }}
              className="w-full px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400"
            >
              🔄 Start Over
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>How it works:</strong> 1) Enter a topic 2) Choose tone and length 3) Generate post 4) Customize hashtags 5) Publish directly to LinkedIn!
        </p>
      </div>
    </div>
  );
}
