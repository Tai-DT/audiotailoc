'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Plus, X, Upload, Youtube, Link, Github, Calendar, DollarSign, Users, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';

interface ProjectFormProps {
  project?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Basic Information
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [clientLogo, setClientLogo] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('DRAFT');
  
  // Media
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  
  // Links
  const [liveUrl, setLiveUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  
  // Project Details
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('');
  const [teamSize, setTeamSize] = useState<number | ''>('');
  const [budget, setBudget] = useState('');
  
  // Technologies & Features
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  
  // Case Study
  const [testimonial, setTestimonial] = useState('');
  const [results, setResults] = useState('');
  const [challenges, setChallenges] = useState('');
  const [solutions, setSolutions] = useState('');
  
  // Settings
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number | ''>(0);
  
  // Input fields for arrays
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setSlug(project.slug || '');
      setShortDescription(project.shortDescription || '');
      setDescription(project.description || '');
      setClient(project.client || '');
      setClientLogo(project.clientLogo || '');
      setCategory(project.category || '');
      setStatus(project.status || 'DRAFT');
      
      setThumbnailImage(project.thumbnailImage || '');
      setCoverImage(project.coverImage || '');
      setImages(project.images ? JSON.parse(project.images) : []);
      setYoutubeVideoUrl(project.youtubeVideoUrl || '');
      
      setLiveUrl(project.liveUrl || '');
      setDemoUrl(project.demoUrl || '');
      setGithubUrl(project.githubUrl || '');
      
      setStartDate(project.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : '');
      setEndDate(project.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : '');
      setDuration(project.duration || '');
      setTeamSize(project.teamSize || '');
      setBudget(project.budget || '');
      
      setTechnologies(project.technologies ? JSON.parse(project.technologies) : []);
      setFeatures(project.features ? JSON.parse(project.features) : []);
      setTags(project.tags ? JSON.parse(project.tags) : []);
      
      setTestimonial(project.testimonial || '');
      setResults(project.results || '');
      setChallenges(project.challenges || '');
      setSolutions(project.solutions || '');
      
      setIsActive(project.isActive ?? true);
      setIsFeatured(project.isFeatured ?? false);
      setDisplayOrder(project.displayOrder ?? 0);
    }
  }, [project]);

  // Ensure API client carries token for uploads and mutations
  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
    }
  }, [token]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!project && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [name, project]);

  const handleImageUpload = async (file: File, type: 'thumbnail' | 'cover' | 'gallery' | 'clientLogo') => {
    try {
      setUploadingImage(true);
      // Use dedicated upload method which sets proper headers and includes auth token
      const response = await apiClient.uploadFile(file);
      const responseData = response.data as any;
      const imageUrl = responseData.url || responseData.secure_url;

      switch (type) {
        case 'thumbnail':
          setThumbnailImage(imageUrl);
          break;
        case 'cover':
          setCoverImage(imageUrl);
          break;
        case 'clientLogo':
          setClientLogo(imageUrl);
          break;
        case 'gallery':
          setImages([...images, imageUrl]);
          break;
      }

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error('Project name is required');
      return;
    }

    try {
      setLoading(true);

      const projectData: any = {
        name,
        slug,
        shortDescription,
        description,
        client,
        clientLogo,
        category,
        status,
        thumbnailImage,
        coverImage,
        images: images.length > 0 ? images : undefined,
        youtubeVideoUrl,
        liveUrl,
        demoUrl,
        githubUrl,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        duration,
        teamSize: teamSize || undefined,
        budget,
        technologies: technologies.length > 0 ? technologies : undefined,
        features: features.length > 0 ? features : undefined,
        tags: tags.length > 0 ? tags : undefined,
        testimonial,
        results,
        challenges,
        solutions,
        isActive,
        isFeatured,
        displayOrder: displayOrder || 0,
        userId: user?.id || 'system',
      };

      if (project) {
        await apiClient.put(`/projects/${project.id}`, projectData);
        toast.success('Project updated successfully');
      } else {
        await apiClient.post('/projects', projectData);
        toast.success('Project created successfully');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="case-study">Case Study</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="project-slug"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief project description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed project description"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Client or company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Web Development, Mobile App"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Thumbnail Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'thumbnail');
                      }}
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  {thumbnailImage && (
                    <img src={thumbnailImage} alt="Thumbnail" className="w-32 h-32 object-cover rounded" />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'cover');
                      }}
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  {coverImage && (
                    <img src={coverImage} alt="Cover" className="w-32 h-32 object-cover rounded" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Client Logo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'clientLogo');
                    }}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                {clientLogo && (
                  <img src={clientLogo} alt="Client Logo" className="w-32 h-16 object-contain rounded bg-gray-50" />
                )}
              </div>

              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'gallery');
                    }}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative">
                        <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                YouTube Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="youtubeVideoUrl">YouTube Video URL</Label>
                <Input
                  id="youtubeVideoUrl"
                  value={youtubeVideoUrl}
                  onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-sm text-muted-foreground">
                  Enter the full YouTube URL. The video ID will be extracted automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 3 months"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="Number of team members"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., $10,000 - $50,000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="liveUrl"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="demoUrl"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://demo.example.com"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technologies & Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Technologies Used</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add technology"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechnology();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTechnology} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Key Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add feature"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="case-study" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Study Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="challenges">Challenges</Label>
                <Textarea
                  id="challenges"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="What challenges did you face?"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solutions">Solutions</Label>
                <Textarea
                  id="solutions"
                  value={solutions}
                  onChange={(e) => setSolutions(e.target.value)}
                  placeholder="How did you solve the challenges?"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="results">Results & Impact</Label>
                <Textarea
                  id="results"
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="What were the outcomes and impact?"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testimonial">Client Testimonial</Label>
                <Textarea
                  id="testimonial"
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  placeholder="Client feedback or testimonial"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this project visible on the website
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isFeatured">Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Show this project in featured sections
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="0"
                />
                <p className="text-sm text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
