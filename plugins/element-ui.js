import Vue from 'vue'
import {
  Pagination,
  Dialog,
  Autocomplete,
  Input,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Option,
  OptionGroup,
  Button,
  Popover,
  Breadcrumb,
  BreadcrumbItem,
  Loading,
  MessageBox,
  Message,
  Form,
  FormItem,
  Select,
} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Select)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(Popover)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = Message
