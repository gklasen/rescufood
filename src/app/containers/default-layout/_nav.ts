import { INavData } from '@coreui/angular';
import { environment } from 'src/environments/environment.prod';

export const navItems: INavData[] = [
<<<<<<< HEAD
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    } 
  },
  {
    title: true,
    name: 'Ingredients'
  },  
  {
    name: 'Overview',
    url: '/ingredients/ingredients_overview',
    iconComponent: { name: 'cil-apple' }
  },
  {
    name: 'Insertion',
    url: '/ingredients/ingredient_insertion',
    iconComponent: { name: 'cil-plus' }
  },
  {
    title: true,
    name: 'Recipes'
  },  
  {
    name: 'Overview',
    url: '/recipes/recipes_overview',
    iconComponent: { name: 'cil-fastfood' }
  },
  {
    name: 'Insertion',
    url: '/recipes/recipe_insertion',
    iconComponent: { name: 'cil-plus' }
  },
  {
    title: true,
    name: 'Categories'
  },
  {
    name: 'Overview',
    url: '/categories/categories_overview',
    iconComponent: { name: 'cil-list' }
  },
  {
    title: true,
    name: 'Drafts'
  },
  {
    name: 'Inbox',
    url: '/drafts/drafts_overview',
    iconComponent: { name: 'cil-envelope-closed' }
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    linkProps: { fragment: 'someAnchor' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Components',
    title: true
  },
  {
    name: 'Base',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' },
    children: [
=======

  ...(environment.HIDE_ROUTES
    ? [
      {
        name: 'Dashboard',
        url: '/dashboard',
        iconComponent: { name: 'cil-speedometer' }
      },
      {
        title: true,
        name: 'Videos'
      },
      {
        name: 'Courses',
        url: '/courses',
        iconComponent: { name: 'cil-video' },
        class: 'loala_link', 
        children: [
          {
            name: 'Videos',
            url: '/courses/videos'
          },
          {
            name: 'Upload',
            url: '/courses/file-upload'
          } 
        ]
      },
      {
        name: 'Performances',
        url: '/performances',
        iconComponent: { name: 'cil-voice-over-record' }
      },
    ]
    : [
>>>>>>> 5a60097796d352e7af3ff3278226200c5c8782ce
      {
        name: 'Dashboard',
        url: '/dashboard',
        iconComponent: { name: 'cil-speedometer' }
      },
      {
        title: true,
        name: 'Videos'
      },
      {
        name: 'Courses',
        url: '/courses',
        iconComponent: { name: 'cil-video' },
        class: 'loala_link', 
        children: [
          {
            name: 'Videos',
            url: '/courses/videos'
          },
          {
            name: 'Upload',
            url: '/courses/file-upload'
          } 
        ]
      },
      {
        name: 'Performances',
        url: '/performances',
        iconComponent: { name: 'cil-voice-over-record' }
      },
      {
        title: true,
        name: 'Theme'
      },
      {
        name: 'Colors',
        url: '/theme/colors',
        iconComponent: { name: 'cil-drop' }
      },
      {
        name: 'Typography',
        url: '/theme/typography',
        linkProps: { fragment: 'someAnchor' },
        iconComponent: { name: 'cil-pencil' }
      },
      {
        name: 'Components',
        title: true
      },
      {
        name: 'Base',
        url: '/base',
        iconComponent: { name: 'cil-puzzle' },
        children: [
          {
            name: 'Accordion',
            url: '/base/accordion'
          },
          {
            name: 'Breadcrumbs',
            url: '/base/breadcrumbs'
          },
          {
            name: 'Cards',
            url: '/base/cards'
          },
          {
            name: 'Carousel',
            url: '/base/carousel'
          },
          {
            name: 'Collapse',
            url: '/base/collapse'
          },
          {
            name: 'List Group',
            url: '/base/list-group'
          },
          {
            name: 'Navs & Tabs',
            url: '/base/navs'
          },
          {
            name: 'Pagination',
            url: '/base/pagination'
          },
          {
            name: 'Placeholder',
            url: '/base/placeholder'
          },
          {
            name: 'Popovers',
            url: '/base/popovers'
          },
          {
            name: 'Progress',
            url: '/base/progress'
          },
          {
            name: 'Spinners',
            url: '/base/spinners'
          },
          {
            name: 'Tables',
            url: '/base/tables'
          },
          {
            name: 'Tabs',
            url: '/base/tabs'
          },
          {
            name: 'Tooltips',
            url: '/base/tooltips'
          }
        ]
      },
      {
        name: 'Buttons',
        url: '/buttons',
        iconComponent: { name: 'cil-cursor' },
        children: [
          {
            name: 'Buttons',
            url: '/buttons/buttons'
          },
          {
            name: 'Button groups',
            url: '/buttons/button-groups'
          },
          {
            name: 'Dropdowns',
            url: '/buttons/dropdowns'
          },
        ]
      },
      {
        name: 'Forms',
        url: '/forms',
        iconComponent: { name: 'cil-notes' },
        children: [
          {
            name: 'Form Control',
            url: '/forms/form-control'
          },
          {
            name: 'Select',
            url: '/forms/select'
          },
          {
            name: 'Checks & Radios',
            url: '/forms/checks-radios'
          },
          {
            name: 'Range',
            url: '/forms/range'
          },
          {
            name: 'Input Group',
            url: '/forms/input-group'
          },
          {
            name: 'Floating Labels',
            url: '/forms/floating-labels'
          },
          {
            name: 'Layout',
            url: '/forms/layout'
          },
          {
            name: 'Validation',
            url: '/forms/validation'
          }
        ]
      },
      {
        name: 'Charts',
        url: '/charts',
        iconComponent: { name: 'cil-chart-pie' }
      },
      {
        name: 'Icons',
        iconComponent: { name: 'cil-star' },
        url: '/icons',
        children: [
          {
            name: 'CoreUI Free',
            url: '/icons/coreui-icons',
            badge: {
              color: 'success',
              text: 'FREE'
            }
          }
        ]
      },
      {
        name: 'Notifications',
        url: '/notifications',
        iconComponent: { name: 'cil-bell' },
        children: [
          {
            name: 'Alerts',
            url: '/notifications/alerts'
          },
          {
            name: 'Badges',
            url: '/notifications/badges'
          },
          {
            name: 'Modal',
            url: '/notifications/modal'
          },
          {
            name: 'Toast',
            url: '/notifications/toasts'
          }
        ]
      },
      {
        name: 'Widgets',
        url: '/widgets',
        iconComponent: { name: 'cil-calculator' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        title: true,
        name: 'Extras'
      },
      {
        name: 'Pages',
        url: '/login',
        iconComponent: { name: 'cil-star' },
        children: [
          {
            name: 'Login',
            url: '/login'
          },
          {
            name: 'Register',
            url: '/register'
          },
          {
            name: 'Error 404',
            url: '/404'
          },
          {
            name: 'Error 500',
            url: '/500'
          }
        ]
      },
      ]),
  

];
