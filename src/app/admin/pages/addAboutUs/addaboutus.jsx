'use client';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamically import JoditEditor for SSR compatibility
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: true });

const AboutUs = () => {
    const editorRef = useRef(null);
    const [formData, setFormData] = useState({
        Title: '',
        description: '',
        Text: '',
    });
    const [aboutUs, setAboutUs] = useState(null);
    const [editorContent, setEditorContent] = useState(''); // Track content separately for JoditEditor
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Load JoditEditor once the component is mounted and data is fetched
    useEffect(() => {
        async function fetchAboutUs() {
            try {
                const response = await axios.get('/api/aboutus');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const existingContent = response.data[0];
                    setAboutUs(existingContent);
                    setFormData({
                        Title: existingContent.Title || '',
                        description: existingContent.description || '',
                        Text: existingContent.Text || '',
                    });
                    setEditorContent(existingContent.Text || ''); // Set initial content for JoditEditor
                }
            } catch (error) {
                console.error('Error fetching About Us content:', error);
            } finally {
                setIsEditorReady(true); // Editor is ready to load
            }
        }
        fetchAboutUs();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTextChange = (content) => {
        setFormData({ ...formData, Text: content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (aboutUs && aboutUs.id) {
                // Update existing About Us content
                await axios.put(`/api/aboutus/${aboutUs.id}`, formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                // Create new About Us content
                const response = await axios.post('/api/aboutus', formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setAboutUs(response.data);
            }
            alert('About Us content saved successfully!');
        } catch (error) {
            console.error('Error saving About Us content:', error);
            alert('Failed to save About Us content.');
        }
    };

    return (
        <div className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">About Us</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-600 font-medium">Title:</label>
                    <input
                        type="text"
                        name="Title"
                        value={formData.Title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Text:</label>
                    {isEditorReady && (
                      <JoditEditor
                      ref={editorRef}
                      value={editorContent}
                      onChange={handleTextChange}
                      config={{
                        readonly: false,
                        placeholder: 'Start writing your About Us content...',
                      }}
                    />
                    )}
                </div>
                <button type="submit" className="w-full mt-4 p-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-800 transition">
                    {aboutUs ? 'Update About Us' : 'Save About Us'}
                </button>
            </form>
        </div>
    );
};

export default AboutUs;
