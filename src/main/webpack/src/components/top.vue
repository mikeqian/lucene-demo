<template>
    <div id="divTopContainer">
        <header class="main-header">
            <a href="#" class="logo">
                <img src="../assets/dist/img/credit/visa.png">
            </a>
            <!-- see help here https://www.almsaeedstudio.com/themes/AdminLTE/documentation/index.html#component-main-header-->
            <!-- Header Navbar: style can be found in header.less -->
            <nav class="navbar navbar-static-top" role="navigation">
                <!-- Navbar Right Menu -->
                <div class="navbar-custom-menu">
                    <ul class="nav navbar-nav">
                        <!-- Messages: style can be found in dropdown.less-->
                        <li class="dropdown messages-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-envelope-o"></i>
                                <span class="label label-success">4</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>

        <aside class="main-sidebar">
            <!-- sidebar: style can be found in sidebar.less -->
            <section class="sidebar" style="height: auto;">
                <!-- sidebar menu: : style can be found in sidebar.less -->
                <ul class="sidebar-menu">
                    <li class="header">功能菜单</li>
                    <li class="active treeview">
                        <a href="#">
                            <i class="fa fa-dashboard"></i> <span>搜索</span> <i
                                class="fa fa-angle-left pull-right"></i>
                        </a>
                        <ul class="treeview-menu">
                            <li><a v-link="{name : 'dashboard'}"><i class="fa fa-book"></i> <span>Search</span></a></li>
                            <li><a v-link="{name : 'config'}"><i class="fa fa-book"></i> <span>Config</span></a></li>
                        </ul>
                    </li>
                </ul>
            </section>
            <!-- /.sidebar -->
        </aside>
    </div>
</template>
<script type="text/babel">
    document.title = "后台管理";
    import {modal} from  'vue-strap';
    import {key}  from "../libs/config"
    import app  from "../assets/dist/js/app"
    import util from '../libs/util'
    export default {
        data(){
            return {
                flag: localStorage.getItem("flag"),
                proxy: localStorage.getItem("proxy"),
                showModal: false,
                configName: key,
                isAdmin: util.isAdmin()
            }
        },
        methods: {},
        ready(){
            setTimeout(()=> {
                app()
            }, 10)
        },
        components: {
            modal
        }
    }

</script>
<style>

</style>