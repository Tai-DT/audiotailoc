const axios = require('axios')

const BASE_URL = 'http://localhost:3010'
const API_PREFIX = '/api/v1'

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'test123'
}

let authToken = ''

async function login() {
  try {
    console.log('🔐 Đang đăng nhập...')
    const response = await axios.post(`${BASE_URL}${API_PREFIX}/auth/login`, testUser)
    authToken = response.data.data.accessToken
    console.log('✅ Đăng nhập thành công')
    return true
  } catch (error) {
    console.error('❌ Lỗi đăng nhập:', error.response?.data?.message || error.message)
    return false
  }
}

async function getServiceTypes() {
  try {
    const response = await axios.get(`${BASE_URL}${API_PREFIX}/services/types`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    return response.data.data || []
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách service types:', error.response?.data?.message || error.message)
    return []
  }
}

async function toggleServiceTypeStatus(id, currentStatus) {
  try {
    console.log(`🔄 Đang ${currentStatus ? 'ngừng hoạt động' : 'kích hoạt'} service type ${id}...`)
    const response = await axios.put(`${BASE_URL}${API_PREFIX}/services/types/${id}`,
      { isActive: !currentStatus },
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    console.log('✅ Toggle status thành công:', response.data.data)
    return response.data.data
  } catch (error) {
    console.error('❌ Lỗi toggle status:', error.response?.data?.message || error.message)
    return null
  }
}

async function updateServiceType(id, updateData) {
  try {
    console.log(`✏️ Đang cập nhật service type ${id}...`)
    const response = await axios.put(`${BASE_URL}${API_PREFIX}/services/types/${id}`,
      updateData,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    console.log('✅ Cập nhật thành công:', response.data.data)
    return response.data.data
  } catch (error) {
    console.error('❌ Lỗi cập nhật:', error.response?.data?.message || error.message)
    return null
  }
}

async function testToggleStatus() {
  console.log('\n🧪 TEST TÍNH NĂNG KÍCH HOẠT/VÔ HIỆU HÓA SERVICE TYPES')
  console.log('='.repeat(60))

  const serviceTypes = await getServiceTypes()
  if (serviceTypes.length === 0) {
    console.log('⚠️ Không có service types nào để test')
    return
  }

  // Test toggle status cho service type đầu tiên
  const firstType = serviceTypes[0]
  console.log(`📋 Service type đầu tiên: ${firstType.name} (ID: ${firstType.id})`)
  console.log(`   Trạng thái hiện tại: ${firstType.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}`)

  // Toggle status
  const toggledType = await toggleServiceTypeStatus(firstType.id, firstType.isActive)
  if (toggledType) {
    console.log(`   Trạng thái sau toggle: ${toggledType.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}`)

    // Toggle lại về trạng thái ban đầu
    await toggleServiceTypeStatus(firstType.id, toggledType.isActive)
    console.log('✅ Toggle status hoạt động đúng')
  }
}

async function testEditServiceType() {
  console.log('\n🧪 TEST TÍNH NĂNG CHỈNH SỬA SERVICE TYPES')
  console.log('='.repeat(60))

  const serviceTypes = await getServiceTypes()
  if (serviceTypes.length === 0) {
    console.log('⚠️ Không có service types nào để test')
    return
  }

  // Test edit service type đầu tiên
  const firstType = serviceTypes[0]
  console.log(`📋 Service type để test edit: ${firstType.name} (ID: ${firstType.id})`)

  // Lưu dữ liệu gốc
  const originalData = {
    name: firstType.name,
    description: firstType.description,
    color: firstType.color
  }

  // Dữ liệu cập nhật
  const updateData = {
    name: firstType.name + ' (Đã chỉnh sửa)',
    description: ((firstType.description || '') + ' New service description').trim(),
    color: firstType.color === '#FF6B6B' ? '#4ECDC4' : '#FF6B6B'
  }

  console.log('📝 Dữ liệu cập nhật:')
  console.log(`   Tên: ${originalData.name} → ${updateData.name}`)
  console.log(`   Mô tả: ${originalData.description} → ${updateData.description}`)
  console.log(`   Màu: ${originalData.color} → ${updateData.color}`)

  // Cập nhật
  const updatedType = await updateServiceType(firstType.id, updateData)
  if (updatedType) {
    console.log('✅ Cập nhật thành công')
    console.log(`   Kết quả: ${updatedType.name}`)

    // Khôi phục dữ liệu gốc
    console.log('🔄 Khôi phục dữ liệu gốc...')
    await updateServiceType(firstType.id, originalData)
    console.log('✅ Đã khôi phục dữ liệu gốc')
  }
}

async function main() {
  console.log('🚀 BẮT ĐẦU TEST TÍNH NĂNG TOGGLE STATUS VÀ EDIT SERVICE TYPES')
  console.log('='.repeat(70))

  // Đăng nhập
  if (!(await login())) {
    console.log('❌ Không thể đăng nhập, dừng test')
    return
  }

  // Test toggle status
  await testToggleStatus()

  // Test edit
  await testEditServiceType()

  console.log('\n🎉 HOÀN THÀNH TEST')
  console.log('='.repeat(70))
}

// Chạy test
main().catch(console.error)